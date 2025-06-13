import { useState, useEffect } from "react";

interface ScanStats {
  total: number;
  today: number;
  thisWeek: number;
}

interface UseScanStatsReturn {
  stats: ScanStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useScanStats = (): UseScanStatsReturn => {
  const [stats, setStats] = useState<ScanStats>({
    total: 0,
    today: 0,
    thisWeek: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || "Failed to fetch statistics");
        // Use fallback data on error
        setStats(result.data || { total: 0, today: 0, thisWeek: 0 });
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching scan stats:", err);
      // Keep existing stats on error
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { stats, isLoading, error, refetch };
};
