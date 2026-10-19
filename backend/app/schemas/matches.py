from pydantic import BaseModel
from datetime import datetime


class MatchResponse(BaseModel):
    id: str
    home_team: str
    away_team: str
    venue: str | None
    match_date: str | None
    status: str
    progress: int
    score_home: int | None
    score_away: int | None
    created_at: datetime

    class Config:
        from_attributes = True


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress: int


class UploadResponse(BaseModel):
    job_id: str
    message: str


class EventResponse(BaseModel):
    id: str
    event_type: str
    minute: int
    second: int
    team: str
    player: str | None
    description: str | None
    x: float | None
    y: float | None

    class Config:
        from_attributes = True
