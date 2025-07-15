# app/core/config.py

"""
Defines the application's configuration settings.

This module loads settings from environment variables first, and falls back to a
.env file for local development.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    # This configuration prioritizes system environment variables (like on Render)
    # over a local .env file.
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Core settings
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    APP_NAME: str = "Ziver"

    # Ziver game logic settings
    ZP_DAILY_CHECKIN_BONUS: int = 50
    ZP_STREAK_BONUS: int = 50 # <-- ADDED THIS NEW SETTING
    MINING_CYCLE_HOURS: int = 4
    INITIAL_MINING_RATE_ZP_PER_HOUR: int = 10
    INITIAL_MINING_CAPACITY_ZP: int = 50
    MAX_REFERRALS_PER_USER: int = 20
    REFERRAL_INITIAL_ZP_REWARD: int = 1000
    REFERRAL_DELETION_ZP_COST_PERCENTAGE: float = 0.5


settings = Settings()
