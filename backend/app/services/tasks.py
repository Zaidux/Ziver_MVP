"""
Service layer for handling all interactive task logic, including user-sponsored
tasks and task completions.
"""
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy import or_, not_
from sqlalchemy.orm import Session

from app.db import models
from app.schemas import sponsored_task as sponsored_task_schemas
from app.schemas import task as task_schemas


def create_sponsored_task(
    db: Session, user: models.User, task_data: sponsored_task_schemas.SponsoredTaskCreate
):
    """Deducts ZP from a user to create a user-sponsored task with an expiration."""
    duration_costs = {
        "1_day": {"cost": 10000, "delta": timedelta(days=1)},
        "5_days": {"cost": 30000, "delta": timedelta(days=5)},
        "15_days": {"cost": 100000, "delta": timedelta(days=15)},
    }
    config = duration_costs.get(task_data.duration.value)

    if user.zp_balance < config["cost"]:
        raise HTTPException(
            status_code=402, detail=f"Insufficient ZP. This requires {config['cost']} ZP."
        )

    user.zp_balance -= config["cost"]
    expiration = datetime.now(timezone.utc) + config["delta"]

    new_task = models.Task(
        title=task_data.title,
        description=task_data.description,
        zp_reward=task_data.zp_reward,
        external_link=task_data.external_link,
        type="user_sponsored",
        is_active=True,
        poster_user_id=user.id,
        expiration_date=expiration,
    )
    db.add(new_task)
    db.add(user)
    db.commit()
    db.refresh(new_task)
    return new_task


def get_available_tasks(db: Session, user_id: int):
    """Retrieves all active, non-expired tasks that the user has not completed."""
    completed_task_ids_query = (
        db.query(models.UserTaskCompletion.task_id)
        .filter(models.UserTaskCompletion.user_id == user_id)
        .all()
    )
    completed_task_ids = [task_id for (task_id,) in completed_task_ids_query]

    now = datetime.now(timezone.utc)
    tasks = (
        db.query(models.Task)
        .filter(
            models.Task.is_active.is_(True),
            not_(models.Task.id.in_(completed_task_ids)),
            # Task is valid if it has NO expiration date OR its expiration is in the future
            or_(
                models.Task.expiration_date.is_(None),
                models.Task.expiration_date > now,
            ),
        )
        .all()
    )
    return tasks


def create_task(db: Session, task_data: task_schemas.TaskCreate):
    """Creates a new admin-defined task."""
    db_task = models.Task(**task_data.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def complete_task(db: Session, user: models.User, task_id: int):
    """Records a user's completion of a task and awards ZP."""
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found."
        )
    if not task.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Task is no longer active."
        )

    existing_completion = (
        db.query(models.UserTaskCompletion)
        .filter(
            models.UserTaskCompletion.user_id == user.id,
            models.UserTaskCompletion.task_id == task_id,
        )
        .first()
    )
    if existing_completion:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already completed this task.",
        )

    db_completion = models.UserTaskCompletion(
        user_id=user.id, task_id=task.id, status="completed"
    )
    db.add(db_completion)

    user.zp_balance += task.zp_reward
    user.social_capital_score += task.zp_reward
    db.add(user)

    db.commit()
    db.refresh(db_completion)
    db.refresh(user)

    return {
        "message": f"Task '{task.title}' completed! You earned {task.zp_reward} ZP.",
        "new_zp_balance": user.zp_balance,
        "completion": db_completion,
    }

