"""
PlayScope AI Engine — Multi-Object Tracker Module
Uses DeepSORT for maintaining player identity across frames.
"""

import logging
import numpy as np
from deep_sort_realtime.deepsort_tracker import DeepSort

logger = logging.getLogger(__name__)


class PlayerTracker:
    """DeepSORT-based multi-object tracker for football players."""

    def __init__(
        self,
        max_age: int = 30,
        n_init: int = 3,
        max_cosine_distance: float = 0.3,
        nn_budget: int = 100,
    ):
        """
        Initialize the DeepSORT tracker.

        Args:
            max_age: Maximum frames to keep a track alive without detections.
            n_init: Number of consecutive detections before a track is confirmed.
            max_cosine_distance: Maximum cosine distance for feature matching.
            nn_budget: Maximum gallery size for each track's appearance features.
        """
        self.tracker = DeepSort(
            max_age=max_age,
            n_init=n_init,
            max_cosine_distance=max_cosine_distance,
            nn_budget=nn_budget,
        )
        self.track_history: dict[int, list[dict]] = {}
        logger.info("DeepSORT tracker initialized")

    def update(self, detections: list[dict], frame: np.ndarray) -> list[dict]:
        """
        Update tracker with new detections.

        Args:
            detections: List of detection dicts with 'bbox' and 'confidence'.
            frame: Current frame (BGR numpy array) for feature extraction.

        Returns:
            List of track dicts with 'track_id', 'bbox', 'center', 'confirmed'.
        """
        if not detections:
            self.tracker.update_tracks([], frame=frame)
            return []

        # Format detections for DeepSORT: ([x1, y1, w, h], confidence, class)
        raw_detections = []
        for det in detections:
            bbox = det["bbox"]  # [x1, y1, x2, y2]
            w = bbox[2] - bbox[0]
            h = bbox[3] - bbox[1]
            raw_detections.append(
                ([bbox[0], bbox[1], w, h], det["confidence"], "player")
            )

        tracks = self.tracker.update_tracks(raw_detections, frame=frame)

        results = []
        for track in tracks:
            if not track.is_confirmed():
                continue

            track_id = track.track_id
            ltrb = track.to_ltrb()  # [left, top, right, bottom]

            track_data = {
                "track_id": track_id,
                "bbox": ltrb.tolist() if hasattr(ltrb, "tolist") else list(ltrb),
                "center": [
                    (ltrb[0] + ltrb[2]) / 2,
                    (ltrb[1] + ltrb[3]) / 2,
                ],
                "confirmed": True,
            }

            results.append(track_data)

            # Store track history
            if track_id not in self.track_history:
                self.track_history[track_id] = []
            self.track_history[track_id].append(track_data["center"])

        return results

    def get_track_history(self, track_id: int) -> list[list[float]]:
        """Get the position history for a specific track."""
        return self.track_history.get(track_id, [])

    def get_all_tracks(self) -> dict[int, list[list[float]]]:
        """Get all track histories."""
        return self.track_history

    def reset(self):
        """Reset the tracker state."""
        self.tracker = DeepSort(
            max_age=self.tracker.max_age,
        )
        self.track_history.clear()
        logger.info("Tracker reset")
