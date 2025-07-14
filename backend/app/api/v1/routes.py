"""
Main API router for the Ziver application.

This module defines all the API endpoints for user management, authentication,
mining, tasks, micro-jobs, and referrals.
"""
# --- Standard Library Imports ---
from datetime import datetime, timedelta, timezone
from typing import List, Annotated

# --- Third-Party Imports ---
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

# --- Application-Specific Imports ---
from app.core import security
from app.core.config import settings
from app.db import database, models
from app.schemas import (
    mining as mining_schemas,
    microjob as microjob_schemas,
    referral as referral_schemas,
    sponsored_task as sponsored_task_schemas,
    task as task_schemas,
    user as user_schemas,
    wallet as wallet_schemas,
)
from app.services import (
    mining as mining_service,
    microjobs as microjobs_service,
    referrals as referrals_service,
    tasks as tasks_service,
    two_factor_auth as two_fa_service,
)

# --- Router & Auth Setup ---
router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/token")

# =================================================================
#                 --- AUTH & USER DEPENDENCIES ---
# =================================================================

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """
    Dependency to get the current authenticated user from a JWT token.
    Validates the token and fetches the user from the database.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = security.decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise credentials_exception

    email: str = payload.get("sub")
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


async def get_active_user(
    current_user: Annotated[models.User, Depends(get_current_user)]
):
    """Dependency to ensure the current user is active."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )
    return current_user


# =================================================================
#              --- AUTHENTICATION & USER MANAGEMENT ---
# =================================================================

@router.post(
    "/register",
    response_model=user_schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user: user_schemas.UserCreate, db: Annotated[Session, Depends(database.get_db)]
):
    """Registers a new user after checking for existing email or handles."""
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already registered"
        )

    db_user = models.User(
        email=user.email,
        hashed_password=security.get_password_hash(user.password),
        full_name=user.full_name,
        zp_balance=0,
        current_mining_rate_zp_per_hour=settings.INITIAL_MINING_RATE_ZP_PER_HOUR,
        current_mining_capacity_zp=settings.INITIAL_MINING_CAPACITY_ZP,
        current_mining_cycle_hours=settings.MINING_CYCLE_HOURS,
    )

    if user.telegram_handle:
        normalized_tg = user.telegram_handle.lower()
        if db.query(models.User).filter(
            models.User.telegram_handle == normalized_tg
        ).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Telegram handle already taken",
            )
        db_user.telegram_handle = normalized_tg

    if user.twitter_handle:
        normalized_tt = user.twitter_handle.lower()
        if db.query(models.User).filter(
            models.User.twitter_handle == normalized_tt
        ).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Twitter handle already taken",
            )
        db_user.twitter_handle = normalized_tt

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post("/token", response_model=user_schemas.Token)
def login_for_access_token(
    login_data: user_schemas.UserLoginWith2FA,
    db: Annotated[Session, Depends(database.get_db)],
):
    """
    Authenticates a user with email and password, returns JWT token.
    Handles optional 2FA.
    """
    # The fix is on this line: .username is changed to .email
    user = db.query(models.User).filter(models.User.email == login_data.email).first()

    if not user or not security.verify_password(
        login_data.password, user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if user.is_2fa_enabled:
        if not login_data.two_fa_code:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="2FA is enabled for this account. Please provide your 2FA code.",
            )
        if not two_fa_service.verify_totp_code(
            user.two_fa_secret, login_data.two_fa_code
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid 2FA code."
            )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=user_schemas.UserResponse)
def read_users_me(current_user: Annotated[models.User, Depends(get_active_user)]):
    """Retrieves the profile of the current authenticated user."""
    return current_user


@router.post("/users/me/link-wallet", response_model=user_schemas.UserResponse)
def link_ton_wallet(
    wallet_data: wallet_schemas.WalletLinkRequest,
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Links a TON wallet address to the current user's profile."""
    if db.query(models.User).filter(
        models.User.ton_wallet_address == wallet_data.wallet_address
    ).first():
        raise HTTPException(
            status_code=409, detail="This wallet address is already linked to another account."
        )
    current_user.ton_wallet_address = wallet_data.wallet_address
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/users/me/daily-checkin", response_model=mining_schemas.ZPClaimResponse)
def perform_daily_checkin(
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Allows a user to perform a daily check-in for a ZP bonus."""
    today = datetime.now(timezone.utc).date()
    if current_user.last_checkin_date == today:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already checked in today.",
        )

    zp_bonus = settings.ZP_DAILY_CHECKIN_BONUS
    is_consecutive = current_user.last_checkin_date and (
        today - current_user.last_checkin_date
    ).days == 1

    if is_consecutive:
        current_user.daily_streak_count += 1
    else:
        current_user.daily_streak_count = 1

    current_user.last_checkin_date = today
    current_user.zp_balance += zp_bonus
    current_user.social_capital_score += zp_bonus
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return {
        "message": (
            f"Daily check-in successful! You received {zp_bonus} ZP. "
            f"Current streak: {current_user.daily_streak_count} days."
        ),
        "zp_claimed": zp_bonus,
        "new_zp_balance": current_user.zp_balance,
    }

# =================================================================
#                         --- ZP MINING ---
# =================================================================


@router.post("/mining/start", response_model=mining_schemas.MiningStartResponse)
def start_mining_cycle(
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Initiates a ZP mining cycle for the authenticated user."""
    return mining_service.start_mining(db, current_user)


@router.post("/mining/claim", response_model=mining_schemas.ZPClaimResponse)
def claim_mined_zp(
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Claims ZP earned from the completed mining cycle."""
    return mining_service.claim_zp(db, current_user)


@router.post("/mining/upgrade", response_model=mining_schemas.MinerUpgradeResponse)
def upgrade_miner_stats(
    upgrade_req: mining_schemas.MinerUpgradeRequest,
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Upgrades the user's ZP miner capabilities."""
    return mining_service.upgrade_miner(db, current_user, upgrade_req)

# =================================================================
#                  --- MICRO-JOB MARKETPLACE ---
# =================================================================


@router.post(
    "/microjobs",
    response_model=microjob_schemas.MicroJobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_microjob(
    job_data: microjob_schemas.MicroJobCreate,
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Allows an authenticated user to post a new micro-job."""
    return microjobs_service.create_microjob(db, current_user, job_data)

# --- ADD THIS CODE TO YOUR api/v1/routes.py FILE ---

@router.get("/tasks", response_model=List[task_schemas.TaskResponse])
def read_available_tasks(
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """
    Retrieves all available tasks for the current authenticated user.
    """
    return tasks_service.get_available_tasks(db=db, user_id=current_user.id)


@router.get("/micro-jobs", response_model=List[microjob_schemas.MicroJobResponse])
def read_available_micro_jobs(db: Annotated[Session, Depends(database.get_db)]):
    """
    Retrieves all publicly available and active micro-jobs.
    """
    return microjobs_service.get_microjobs(db=db)

# --- END OF CODE TO ADD ---


# Add more endpoints here as they are developed
