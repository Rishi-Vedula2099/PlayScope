"""
PlayScope AI Engine — Statistics Generator
Computes match statistics from tracking and event data.
"""

import logging
import math
from collections import defaultdict

logger = logging.getLogger(__name__)


class StatsGenerator:
    """Generates comprehensive match statistics from tracking data."""

    def __init__(self, pitch_width: int = 1920, pitch_height: int = 1080):
        self.pitch_width = pitch_width
        self.pitch_height = pitch_height
        self.possession_frames: dict[str, int] = {"home": 0, "away": 0}
        self.player_positions: dict[int, list[dict]] = defaultdict(list)
        self.team_assignments: dict[int, str] = {}

    def assign_teams(self, tracks: list[dict], frame_width: int):
        """
        Simple team assignment based on average x-position.
        Players on the left half are 'home', right half are 'away'.
        In production, use jersey color clustering (k-means on dominant colors).
        """
        for track in tracks:
            track_id = track["track_id"]
            if track_id not in self.team_assignments:
                # Simple heuristic: left side = home, right side = away
                if track["center"][0] < frame_width / 2:
                    self.team_assignments[track_id] = "home"
                else:
                    self.team_assignments[track_id] = "away"

    def update(
        self,
        frame_number: int,
        tracks: list[dict],
        ball_pos: list[float] | None,
        closest_player_id: int | None,
    ):
        """Update statistics with data from a single frame."""
        # Track positions for heatmap
        for track in tracks:
            team = self.team_assignments.get(track["track_id"], "home")
            self.player_positions[track["track_id"]].append({
                "x": track["center"][0] / self.pitch_width * 100,
                "y": track["center"][1] / self.pitch_height * 100,
                "frame": frame_number,
                "team": team,
            })

        # Possession tracking
        if closest_player_id is not None:
            team = self.team_assignments.get(closest_player_id, "home")
            self.possession_frames[team] += 1

    def compute_possession(self) -> dict[str, float]:
        """Compute ball possession percentages."""
        total = sum(self.possession_frames.values())
        if total == 0:
            return {"home": 50.0, "away": 50.0}

        return {
            "home": round(self.possession_frames["home"] / total * 100, 1),
            "away": round(self.possession_frames["away"] / total * 100, 1),
        }

    def generate_heatmap_data(self) -> list[dict]:
        """Generate heatmap points from player position history."""
        heatmap = []

        for track_id, positions in self.player_positions.items():
            team = self.team_assignments.get(track_id, "home")

            for pos in positions:
                heatmap.append({
                    "x": pos["x"],
                    "y": pos["y"],
                    "intensity": 0.3 + 0.7 * (1.0 / (1.0 + len(positions) * 0.01)),
                    "team": team,
                    "player_id": track_id,
                })

        return heatmap

    def compute_stats(self, events: list[dict]) -> dict:
        """Compute full match statistics."""
        possession = self.compute_possession()

        stats = {
            "possession": possession,
            "shots": {"home": 0, "away": 0},
            "passes": {"home": 0, "away": 0},
            "fouls": {"home": 0, "away": 0},
        }

        for event in events:
            event_type = event.get("type")
            player_id = event.get("player_id") or event.get("from_player_id")
            team = self.team_assignments.get(player_id, "home") if player_id else "home"

            if event_type == "shot":
                stats["shots"][team] += 1
            elif event_type == "pass":
                stats["passes"][team] += 1
            elif event_type == "foul":
                stats["fouls"][team] += 1

        return stats

    def get_full_results(self, events: list[dict]) -> dict:
        """Generate complete analysis results."""
        return {
            "stats": self.compute_stats(events),
            "heatmapData": self.generate_heatmap_data(),
            "possession": self.compute_possession(),
            "playerCount": len(self.player_positions),
            "trackedFrames": sum(len(p) for p in self.player_positions.values()),
        }
