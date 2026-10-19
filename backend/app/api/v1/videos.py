import os
import json
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.dependencies import get_db, get_current_user
from app.core.config import get_settings
from app.models.users import User
from app.models.matches import Match
from app.schemas.matches import UploadResponse, JobStatusResponse, MatchResponse
from app.services.video_service import process_video_background

router = APIRouter(prefix="/videos", tags=["Videos"])
settings = get_settings()


@router.post("/upload", response_model=UploadResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload a match video for analysis."""
    # Validate file type
    allowed_types = ["video/mp4", "video/mpeg", "video/avi", "video/quicktime", "video/webm"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid video file type")

    # Create upload directory
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Save file
    file_ext = os.path.splitext(file.filename or "video.mp4")[1]
    saved_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Create match record
    match = Match(
        user_id=current_user.id,
        video_filename=file.filename or "upload.mp4",
        video_path=file_path,
        status="pending",
        progress=0,
    )
    db.add(match)
    await db.flush()
    await db.refresh(match)

    # Start background processing
    background_tasks.add_task(process_video_background, match.id, file_path)

    return UploadResponse(job_id=match.id, message="Video uploaded. Processing started.")


@router.get("/jobs/{job_id}/status", response_model=JobStatusResponse)
async def get_job_status(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get processing status for a video job."""
    result = await db.execute(
        select(Match).where(Match.id == job_id, Match.user_id == current_user.id)
    )
    match = result.scalar_one_or_none()

    if not match:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobStatusResponse(
        job_id=match.id,
        status=match.status,
        progress=match.progress,
    )


@router.get("/jobs/{job_id}/results")
async def get_job_results(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get analysis results for a completed job."""
    result = await db.execute(
        select(Match).where(Match.id == job_id, Match.user_id == current_user.id)
    )
    match = result.scalar_one_or_none()

    if not match:
        raise HTTPException(status_code=404, detail="Job not found")

    if match.status != "completed":
        raise HTTPException(status_code=400, detail=f"Job is {match.status}, not completed")

    if not match.results_json:
        raise HTTPException(status_code=404, detail="No results available")

    return json.loads(match.results_json)


@router.get("/matches", response_model=list[MatchResponse])
async def list_matches(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all matches for the current user."""
    result = await db.execute(
        select(Match)
        .where(Match.user_id == current_user.id)
        .order_by(Match.created_at.desc())
    )
    return result.scalars().all()
