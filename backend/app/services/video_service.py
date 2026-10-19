import json
import asyncio
import logging
from sqlalchemy import update
from app.db.session import async_session_factory
from app.models.matches import Match

logger = logging.getLogger(__name__)


async def update_match_status(match_id: str, status: str, progress: int, results_json: str | None = None):
    """Update match processing status in database."""
    async with async_session_factory() as session:
        values = {"status": status, "progress": progress}
        if results_json is not None:
            values["results_json"] = results_json
        await session.execute(
            update(Match).where(Match.id == match_id).values(**values)
        )
        await session.commit()


def process_video_background(match_id: str, video_path: str):
    """Background task to process video through AI pipeline.

    In production, this would call the AI engine service.
    For demo, it simulates the processing stages.
    """
    asyncio.run(_process_video(match_id, video_path))


async def _process_video(match_id: str, video_path: str):
    """Async video processing pipeline."""
    try:
        logger.info(f"Starting video processing for match {match_id}")

        # Stage 1: Detection (30%)
        await update_match_status(match_id, "processing", 10)
        await asyncio.sleep(2)  # Simulate YOLOv8 detection
        await update_match_status(match_id, "processing", 30)

        # Stage 2: Tracking (60%)
        await asyncio.sleep(2)  # Simulate DeepSORT tracking
        await update_match_status(match_id, "processing", 60)

        # Stage 3: Event extraction (80%)
        await asyncio.sleep(1)  # Simulate event extraction
        await update_match_status(match_id, "processing", 80)

        # Stage 4: Stats generation (100%)
        await asyncio.sleep(1)  # Simulate stats generation

        # Generate demo results
        # In production, this would contain actual AI pipeline output
        results = {
            "matchInfo": {
                "id": match_id,
                "homeTeam": "Home Team",
                "awayTeam": "Away Team",
                "score": {"home": 0, "away": 0},
            },
            "stats": {
                "possession": {"home": 50, "away": 50},
                "shots": {"home": 0, "away": 0},
                "passes": {"home": 0, "away": 0},
            },
            "events": [],
            "message": "Processing complete. Connect AI engine for real results.",
        }

        await update_match_status(
            match_id, "completed", 100, json.dumps(results)
        )
        logger.info(f"Video processing completed for match {match_id}")

    except Exception as e:
        logger.error(f"Video processing failed for match {match_id}: {e}")
        await update_match_status(match_id, "failed", 0)
