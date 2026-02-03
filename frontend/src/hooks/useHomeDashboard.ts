/**
 * Home Dashboard Data Hook
 * 
 * Custom hook for fetching home dashboard data with caching.
 * Provides a simple interface without requiring React Query.
 * 
 * Features:
 * - Single fetch with loading/error states
 * - 60-second stale time (re-fetch after)
 * - Automatic refetch on mount if stale
 * 
 * Usage:
 *   const { data, isLoading, error, refetch } = useHomeDashboard();
 * 
 * ⚠️ DO NOT add transformations, sorting, or filtering here.
 *    The hook returns backend data as-is.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchHomeDashboard } from "../api/homeDashboardApi";
import type { HomeDashboard } from "../types/homeDashboard";

interface UseHomeDashboardResult {
  data: HomeDashboard | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

// Simple in-memory cache
interface CacheEntry {
  data: HomeDashboard;
  timestamp: number;
}

const STALE_TIME_MS = 60_000; // 60 seconds
let cache: CacheEntry | null = null;

function isCacheValid(): boolean {
  if (!cache) return false;
  return Date.now() - cache.timestamp < STALE_TIME_MS;
}

/**
 * Hook to fetch and cache home dashboard data.
 * Returns data directly from backend without modification.
 */
export function useHomeDashboard(): UseHomeDashboardResult {
  const [data, setData] = useState<HomeDashboard | null>(
    cache?.data ?? null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!isCacheValid());
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchHomeDashboard();
      
      // Update cache
      cache = {
        data: result,
        timestamp: Date.now(),
      };

      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error("Failed to fetch dashboard"));
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Fetch if no cache or cache is stale
    if (!isCacheValid()) {
      fetchData();
    } else {
      setData(cache!.data);
      setIsLoading(false);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    // Force refetch, ignoring cache
    cache = null;
    await fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}
