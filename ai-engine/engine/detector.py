"""
PlayScope AI Engine — Player Detection Module
Uses YOLOv8 for detecting players, ball, and referees in football match frames.
"""

import logging
from ultralytics import YOLO
import numpy as np

logger = logging.getLogger(__name__)

# COCO class IDs
PERSON_CLASS_ID = 0
SPORTS_BALL_CLASS_ID = 32


class PlayerDetector:
    """YOLOv8-based football player and ball detector."""

    def __init__(self, model_path: str = "yolov8n.pt", confidence: float = 0.4):
        """
        Initialize the detector.

        Args:
            model_path: Path to YOLOv8 model weights. Default uses nano model.
            confidence: Minimum confidence threshold for detections.
        """
        self.confidence = confidence
        logger.info(f"Loading YOLOv8 model: {model_path}")
        self.model = YOLO(model_path)
        logger.info("YOLOv8 model loaded successfully")

    def detect(self, frame: np.ndarray) -> dict:
        """
        Detect players and ball in a single frame.

        Args:
            frame: BGR image as numpy array.

        Returns:
            Dictionary with 'players' and 'ball' detections.
            Each detection has: bbox (x1, y1, x2, y2), confidence, class_id.
        """
        results = self.model(frame, conf=self.confidence, verbose=False)[0]

        players = []
        ball = None

        for box in results.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            bbox = box.xyxy[0].cpu().numpy().tolist()  # [x1, y1, x2, y2]

            if cls_id == PERSON_CLASS_ID:
                players.append({
                    "bbox": bbox,
                    "confidence": conf,
                    "class_id": cls_id,
                    "center": [
                        (bbox[0] + bbox[2]) / 2,
                        (bbox[1] + bbox[3]) / 2,
                    ],
                })
            elif cls_id == SPORTS_BALL_CLASS_ID:
                if ball is None or conf > ball["confidence"]:
                    ball = {
                        "bbox": bbox,
                        "confidence": conf,
                        "class_id": cls_id,
                        "center": [
                            (bbox[0] + bbox[2]) / 2,
                            (bbox[1] + bbox[3]) / 2,
                        ],
                    }

        return {
            "players": players,
            "ball": ball,
            "player_count": len(players),
        }

    def detect_batch(self, frames: list[np.ndarray]) -> list[dict]:
        """Detect players/ball in a batch of frames."""
        return [self.detect(frame) for frame in frames]
