"use client";

import { useState, useEffect, useCallback } from "react";
import { demoMatchData, type MatchData } from "@/lib/demo-data";

interface UseVideoDataOptions {
  jobId?: string;
  demoMode?: boolean;
}

interface UseVideoDataReturn {
  data: MatchData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useVideoData({ jobId, demoMode = true }: UseVideoDataOptions = {}): UseVideoDataReturn {
  const [data, setData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (demoMode || !jobId) {
        // Simulate network delay for realism
        await new Promise((r) => setTimeout(r, 800));
        setData(demoMatchData);
      } else {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(`${API_BASE}/videos/jobs/${jobId}/results`);
        if (!res.ok) throw new Error("Failed to fetch results");
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      // Fallback to demo data on failure
      setData(demoMatchData);
    } finally {
      setLoading(false);
    }
  }, [jobId, demoMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
