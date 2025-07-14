from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    """Base schema for user data."""
    email: EmailStr
    full_name: Optional[str] = None
    telegram_handle: Optional[str] = None
    twitter_handle: Optional[str] = None

class UserCreate(UserBase):
    """Schema for creating a new user (registration)."""
    password: str = Field(..., min_length=8) # Password should be required and have min length

class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str

class UserResponse(UserBase):
    """Schema for returning user data (response model)."""
    id: int
    zp_balance: int
    social_capital_score: int
    last_checkin_date: Optional[datetime] = None
    current_mining_rate_zp_per_hour: int
    current_mining_capacity_zp: int
    current_mining_cycle_hours: int
    mining_started_at: Optional[datetime] = None
    last_claim_at: Optional[datetime] = None
    daily_streak_count: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None # Optional as it might not be updated yet

    class Config:
        from_attributes = True # Changed from orm_mode = True in Pydantic v2

class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"

# --- ADDED THESE NEW SCHEMAS FOR 2FA ---
class TwoFACode(BaseModel):
    code: str = Field(..., min_length=6, max_length=6, description="6-digit code from authenticator app")

class TwoFASetupResponse(BaseModel):
    secret: str
    qr_code_image: str # Base64 encoded PNG data URL
    message: str

class UserLoginWith2FA(UserLogin):
    """Schema for a login attempt that *might* include a 2FA code."""
    two_fa_code: Optional[str] = Field(None, min_length=6, max_length=6, description="Optional 2FA code if required for login.")

# --- ADD THESE TO app/schemas/user.py ---

class TwoFAGenerationResponse(BaseModel):
    """Response model for the 2FA generation endpoint."""
    secret_key: str
    qr_code_uri: str

class TwoFAEnableRequest(BaseModel):
    """Request model for enabling 2FA."""
    secret_key: str
    two_fa_code: str

# --- END OF 2FA SCHEMAS ADDITION ---

class TokenData(BaseModel):
    """Schema for data stored inside JWT token."""
    email: Optional[str] = None
  
