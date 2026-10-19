import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Integer, ForeignKey, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    home_team: Mapped[str] = mapped_column(String(100), nullable=False, default="Home Team")
    away_team: Mapped[str] = mapped_column(String(100), nullable=False, default="Away Team")
    venue: Mapped[str | None] = mapped_column(String(255), nullable=True)
    match_date: Mapped[str | None] = mapped_column(String(50), nullable=True)
    video_filename: Mapped[str] = mapped_column(String(500), nullable=False)
    video_path: Mapped[str] = mapped_column(String(1000), nullable=False)
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="pending"
    )  # pending, processing, completed, failed
    progress: Mapped[int] = mapped_column(Integer, default=0)
    score_home: Mapped[int | None] = mapped_column(Integer, nullable=True)
    score_away: Mapped[int | None] = mapped_column(Integer, nullable=True)
    results_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    events = relationship("Event", back_populates="match", cascade="all, delete-orphan")
    tracking_data = relationship("TrackingData", back_populates="match", cascade="all, delete-orphan")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    match_id: Mapped[str] = mapped_column(String(36), ForeignKey("matches.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)  # pass, shot, goal, foul, etc.
    minute: Mapped[int] = mapped_column(Integer, nullable=False)
    second: Mapped[int] = mapped_column(Integer, default=0)
    team: Mapped[str] = mapped_column(String(10), nullable=False)  # home, away
    player: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    x: Mapped[float | None] = mapped_column(Float, nullable=True)
    y: Mapped[float | None] = mapped_column(Float, nullable=True)
    target_x: Mapped[float | None] = mapped_column(Float, nullable=True)
    target_y: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    match = relationship("Match", back_populates="events")


class TrackingData(Base):
    __tablename__ = "tracking_data"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    match_id: Mapped[str] = mapped_column(String(36), ForeignKey("matches.id"), nullable=False)
    frame_number: Mapped[int] = mapped_column(Integer, nullable=False)
    timestamp: Mapped[float] = mapped_column(Float, nullable=False)
    player_id: Mapped[int] = mapped_column(Integer, nullable=False)
    team: Mapped[str] = mapped_column(String(10), nullable=False)
    x: Mapped[float] = mapped_column(Float, nullable=False)
    y: Mapped[float] = mapped_column(Float, nullable=False)
    vx: Mapped[float] = mapped_column(Float, default=0.0)
    vy: Mapped[float] = mapped_column(Float, default=0.0)
    ball_x: Mapped[float | None] = mapped_column(Float, nullable=True)
    ball_y: Mapped[float | None] = mapped_column(Float, nullable=True)

    match = relationship("Match", back_populates="tracking_data")
