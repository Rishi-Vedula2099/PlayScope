"""
PlayScope AI Engine — Video Processing Pipeline
Orchestrates the full detection → tracking → events → stats pipeline.
"""

import json
import logging
import os
import cv2
import numpy as np
from pathlib import Path

from engine.detector import PlayerDetector
from engine.tracker import PlayerTracker
from engine.event_extractor import EventExtractor
from engine.stats_generator import StatsGenerator

logger = logging.getLogger(__name__)


class VideoPipeline:
    """End-to-end video analysis pipeline."""

    def __init__(
        self,
        model_path: str = "yolov8n.pt",
        confidence: float = 0.4,
        process_every_n: int = 2,
        output_dir: str = "./output",
    ):
        """
        Initialize the pipeline.

        Args:
            model_path: Path to YOLOv8 weights.
            confidence: Detection confidence threshold.
            process_every_n: Process every Nth frame (skip frames for speed).
            output_dir: Directory to save results.
        """
        self.detector = PlayerDetector(model_path, confidence)
        self.tracker = PlayerTracker(max_age=30, n_init=3)
        self.event_extractor = EventExtractor()
        self.stats_generator = StatsGenerator()
        self.process_every_n = process_every_n
        self.output_dir = output_dir

        os.makedirs(output_dir, exist_ok=True)

    def process_video(
        self,
        video_path: str,
        progress_callback=None,
    ) -> dict:
        """
        Process an entire video file through the pipeline.

        Args:
            video_path: Path to the input video file.
            progress_callback: Optional function(progress: float) called with 0.0-1.0.

        Returns:
            Complete analytics results dictionary.
        """
        logger.info(f"Processing video: {video_path}")

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Cannot open video: {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        logger.info(
            f"Video: {width}x{height}, {fps:.1f} FPS, {total_frames} frames "
            f"(~{total_frames / fps / 60:.1f} minutes)"
        )

        # Update pitch dimensions
        self.event_extractor.pitch_width = width
        self.event_extractor.pitch_height = height
        self.stats_generator.pitch_width = width
        self.stats_generator.pitch_height = height

        frame_number = 0
        tracking_frames = []

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame_number += 1

            # Skip frames for speed
            if frame_number % self.process_every_n != 0:
                continue

            # 1. Detection
            detection_result = self.detector.detect(frame)

            # 2. Tracking
            tracks = self.tracker.update(detection_result["players"], frame)

            # 3. Team assignment (simple heuristic)
            self.stats_generator.assign_teams(tracks, width)

            # 4. Ball position
            ball_pos = (
                detection_result["ball"]["center"]
                if detection_result["ball"]
                else None
            )

            # 5. Find closest player to ball
            closest_id = None
            if ball_pos and tracks:
                min_dist = float("inf")
                for t in tracks:
                    d = np.sqrt(
                        (t["center"][0] - ball_pos[0]) ** 2
                        + (t["center"][1] - ball_pos[1]) ** 2
                    )
                    if d < min_dist:
                        min_dist = d
                        closest_id = t["track_id"]

            # 6. Event extraction
            self.event_extractor.process_frame(frame_number, fps, tracks, ball_pos)

            # 7. Stats update
            self.stats_generator.update(frame_number, tracks, ball_pos, closest_id)

            # 8. Store tracking frame data
            tracking_frames.append({
                "frame": frame_number,
                "timestamp": frame_number / fps,
                "players": [
                    {
                        "id": t["track_id"],
                        "team": self.stats_generator.team_assignments.get(
                            t["track_id"], "home"
                        ),
                        "x": t["center"][0] / width * 100,
                        "y": t["center"][1] / height * 100,
                    }
                    for t in tracks
                ],
                "ball": {
                    "x": ball_pos[0] / width * 100 if ball_pos else 50,
                    "y": ball_pos[1] / height * 100 if ball_pos else 50,
                },
            })

            # Progress callback
            if progress_callback and frame_number % 100 == 0:
                progress_callback(frame_number / total_frames)

        cap.release()

        # Generate final results
        events = self.event_extractor.get_events()
        results = self.stats_generator.get_full_results(events)
        results["events"] = events
        results["trackingFrames"] = tracking_frames
        results["videoInfo"] = {
            "width": width,
            "height": height,
            "fps": fps,
            "totalFrames": total_frames,
            "duration": total_frames / fps,
        }

        # Save results
        output_path = os.path.join(
            self.output_dir,
            Path(video_path).stem + "_results.json",
        )
        with open(output_path, "w") as f:
            json.dump(results, f, indent=2)

        logger.info(
            f"Processing complete. {len(events)} events detected. "
            f"Results saved to {output_path}"
        )

        return results


def main():
    """CLI entrypoint for video processing."""
    import sys

    if len(sys.argv) < 2:
        print("Usage: python pipeline.py <video_path> [model_path]")
        sys.exit(1)

    video_path = sys.argv[1]
    model_path = sys.argv[2] if len(sys.argv) > 2 else "yolov8n.pt"

    logging.basicConfig(level=logging.INFO)

    pipeline = VideoPipeline(model_path=model_path)

    def on_progress(p):
        print(f"Progress: {p * 100:.1f}%")

    results = pipeline.process_video(video_path, progress_callback=on_progress)
    print(f"\nDone! {results['playerCount']} players tracked, {len(results['events'])} events.")


if __name__ == "__main__":
    main()
