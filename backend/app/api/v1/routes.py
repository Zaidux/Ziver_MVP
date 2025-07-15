# app/api/v1/routes.py

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
    
    # --- New Referral Tracking Logic ---
    if user.referrer_id:
        try:
            referrals_service.track_referral(db, user.referrer_id, user.email)
        except HTTPException as e:
            # Optionally log this, but don't block registration
            print(f"Referral tracking failed during registration: {e.detail}")

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
    """Allows a user to perform a daily check-in for a ZP bonus and streak rewards."""
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
        # Reset streak if the last check-in was not yesterday
        current_user.daily_streak_count = 1

    # Add streak bonus if the streak is 5 days or longer
    streak_bonus = 0
    if current_user.daily_streak_count >= 5:
        streak_bonus = settings.ZP_STREAK_BONUS # Assuming you add ZP_STREAK_BONUS = 50 to your settings
        zp_bonus += streak_bonus

    current_user.last_checkin_date = today
    current_user.zp_balance += zp_bonus
    current_user.social_capital_score += zp_bonus
    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    message = (
        f"Daily check-in successful! You received {settings.ZP_DAILY_CHECKIN_BONUS} ZP. "
        f"Current streak: {current_user.daily_streak_count} days."
    )
    if streak_bonus > 0:
        message += f" You also received a streak bonus of {streak_bonus} ZP!"

    return {
        "message": message,
        "zp_claimed": zp_bonus,
        "new_zp_balance": current_user.zp_balance,
    }


@router.post("/users/me/2fa/generate", response_model=user_schemas.TwoFAGenerationResponse)
def generate_2fa_secret(
    current_user: Annotated[models.User, Depends(get_active_user)]
):
    """
    Generates a new 2FA secret and a QR code URI for the user to scan.
    """
    if current_user.is_2fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA is already enabled for this account.",
        )

    secret_key = two_fa_service.generate_totp_secret()
    qr_code_uri = two_fa_service.generate_totp_uri(secret_key, current_user.email)

    return {"secret_key": secret_key, "qr_code_uri": qr_code_uri}


@router.post("/users/me/2fa/enable", status_code=status.HTTP_204_NO_CONTENT)
def enable_2fa(
    two_fa_data: user_schemas.TwoFAEnableRequest,
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """
    Verifies the 2FA code and enables 2FA for the user's account.
    """
    if current_user.is_2fa_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="2FA is already enabled.",
        )

    is_valid = two_fa_service.verify_totp_code(
        two_fa_data.secret_key, two_fa_data.two_fa_code
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 2FA code. Please try again.",
        )

    current_user.two_fa_secret = two_fa_data.secret_key
    current_user.is_2fa_enabled = True
    db.commit()

    return

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
#                           --- TASKS ---
# =================================================================

@router.get("/tasks", response_model=List[task_schemas.TaskResponse])
def read_available_tasks(
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """
    Retrieves all available tasks for the current authenticated user.
    """
    return tasks_service.get_available_tasks(db=db, user_id=current_user.id)


# --- ADD THIS NEW ENDPOINT ---
@router.post(
    "/tasks/sponsor",
    response_model=sponsored_task_schemas.SponsoredTaskResponse, # Assuming you have this schema
    status_code=status.HTTP_201_CREATED
)
def create_sponsored_task(
    task_data: sponsored_task_schemas.SponsoredTaskCreate, # Assuming you have this schema
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """
    Allows a user to create and sponsor a new task by paying with ZP.
    """
    # This will call a function in your tasks_service to handle the logic
    return tasks_service.create_sponsored_task(db, current_user, task_data)

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


@router.get("/microjobs", response_model=List[microjob_schemas.MicroJobResponse])
def read_available_micro_jobs(db: Annotated[Session, Depends(database.get_db)]):
    """
    Retrieves all publicly available and active micro-jobs.
    """
    return microjobs_service.get_microjobs(db=db)

# =================================================================
#                         --- REFERRALS ---
# =================================================================

@router.get("/referrals", response_model=List[referral_schemas.ReferralResponse])
def get_my_referrals(
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Retrieves a list of users referred by the current user."""
    return referrals_service.get_referred_users(db, referrer_id=current_user.id)


@router.post("/referrals/{referred_user_id}/ping", status_code=status.HTTP_200_OK)
def ping_referral(
    referred_user_id: int,
    current_user: Annotated[models.User, Depends(get_active_user)],
):
    """Sends a ping to a referred user."""
    # In a real app, you'd verify this user was actually referred by the current_user first
    return referrals_service.ping_referred_user(referred_user_id)


@router.delete("/referrals/{referral_id}", status_code=status.HTTP_200_OK)
def remove_referral(
    referral_id: int,
    current_user: Annotated[models.User, Depends(get_active_user)],
    db: Annotated[Session, Depends(database.get_db)],
):
    """Deletes a referral relationship."""
    return referrals_service.delete_referral(db, referrer=current_user, referral_id=referral_id)
