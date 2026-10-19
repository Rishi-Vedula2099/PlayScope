"""
PlayScope AI Engine — Event Extraction Module
Extracts football events (passes, shots, fouls) from tracking data.
"""

import logging
import math
import numpy as np

logger = logging.getLogger(__name__)


class EventExtractor:
    """Extracts football events from player tracking and ball position data."""

    def __init__(
        self,
        pitch_width: int = 1920,
        pitch_height: int = 1080,
        pass_distance_threshold: float = 100,
        shot_zone_x: float = 0.75,
        speed_threshold: float = 50,
    ):
        """
        Initialize event extractor.

        Args:
            pitch_width: Frame/pitch width in pixels.
            pitch_height: Frame/pitch height in pixels.
            pass_distance_threshold: Min distance for a pass event.
            shot_zone_x: X-ratio beyond which shots are detected.
            speed_threshold: Speed threshold for foul detection.
        """
        self.pitch_width = pitch_width
        self.pitch_height = pitch_height
        self.pass_distance_threshold = pass_distance_threshold
        self.shot_zone_x = shot_zone_x
        self.speed_threshold = speed_threshold
        self.events: list[dict] = []
        self.prev_ball_owner: int | None = None
        self.prev_ball_pos: list[float] | None = None

    def _distance(self, p1: list[float], p2: list[float]) -> float:
        return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)

    def _find_closest_player(
        self, ball_pos: list[float], tracks: list[dict]
    ) -> dict | None:
        """Find the player closest to the ball."""
        if not tracks or not ball_pos:
            return None

        min_dist = float("inf")
        closest = None

        for track in tracks:
            dist = self._distance(ball_pos, track["center"])
            if dist < min_dist:
                min_dist = dist
                closest = track

        return closest if min_dist < self.pass_distance_threshold else None

    def process_frame(
        self,
        frame_number: int,
        fps: float,
        tracks: list[dict],
        ball_pos: list[float] | None,
    ):
        """
        Process a single frame to extract events.

        Args:
            frame_number: Current frame index.
            fps: Frames per second.
            tracks: List of player track dicts.
            ball_pos: Ball center position [x, y] or None.
        """
        if not ball_pos:
            return

        minute = int(frame_number / fps / 60)
        second = int((frame_number / fps) % 60)

        # Find current ball owner
        current_owner = self._find_closest_player(ball_pos, tracks)

        if current_owner and self.prev_ball_owner is not None:
            # Check for pass (ball changes from one player to another)
            if current_owner["track_id"] != self.prev_ball_owner:
                self.events.append({
                    "type": "pass",
                    "minute": minute,
                    "second": second,
                    "frame": frame_number,
                    "from_player_id": self.prev_ball_owner,
                    "to_player_id": current_owner["track_id"],
                    "x": ball_pos[0] / self.pitch_width * 100,
                    "y": ball_pos[1] / self.pitch_height * 100,
                })

        # Check for shot (ball in attacking zone moving fast)
        if self.prev_ball_pos and ball_pos:
            ball_speed = self._distance(ball_pos, self.prev_ball_pos)
            ball_x_ratio = ball_pos[0] / self.pitch_width

            if (
                ball_speed > self.speed_threshold
                and ball_x_ratio > self.shot_zone_x
            ):
                self.events.append({
                    "type": "shot",
                    "minute": minute,
                    "second": second,
                    "frame": frame_number,
                    "player_id": current_owner["track_id"] if current_owner else None,
                    "x": ball_pos[0] / self.pitch_width * 100,
                    "y": ball_pos[1] / self.pitch_height * 100,
                    "speed": ball_speed,
                })

        # Update state
        self.prev_ball_owner = (
            current_owner["track_id"] if current_owner else self.prev_ball_owner
        )
        self.prev_ball_pos = ball_pos

    def get_events(self) -> list[dict]:
        """Return all extracted events sorted by time."""
        return sorted(self.events, key=lambda e: (e["minute"], e["second"]))

    def reset(self):
        """Clear all events."""
        self.events.clear()
        self.prev_ball_owner = None
        self.prev_ball_pos = None
