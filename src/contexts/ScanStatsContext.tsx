'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ScanStats {
  total: number;
  today: number;
  thisWeek: number;
}

interface ScanStatsContextType {
  stats: ScanStats;
  isLoading: boolean;
  error: string | null;
  refreshStats: () => void;
  incrementStats: () => void; // For immediate local increment
}

const ScanStatsContext = createContext<ScanStatsContextType | undefined>(undefined);

interface ScanStatsProviderProps {
  children: ReactNode;
}

export const ScanStatsProvider: React.FC<ScanStatsProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<ScanStats>({ total: 0, today: 0, thisWeek: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch statistics');
        // Use fallback data on error
        setStats(result.data || { total: 0, today: 0, thisWeek: 0 });
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching scan stats:', err);
      // Keep existing stats on error
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = () => {
    fetchStats();
  };

  // Optimistic update - increment stats immediately for better UX
  const incrementStats = () => {
    setStats(prevStats => ({
      total: prevStats.total + 1,
      today: prevStats.today + 1,
      thisWeek: prevStats.thisWeek + 1
    }));
    
    // Then fetch actual stats to ensure accuracy
    setTimeout(() => {
      fetchStats();
    }, 1000); // Small delay to ensure the database is updated
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 5 minutes as backup
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const value: ScanStatsContextType = {
    stats,
    isLoading,
    error,
    refreshStats,
    incrementStats
  };

  return (
    <ScanStatsContext.Provider value={value}>
      {children}
    </ScanStatsContext.Provider>
  );
};

export const useScanStatsContext = (): ScanStatsContextType => {
  const context = useContext(ScanStatsContext);
  if (context === undefined) {
    throw new Error('useScanStatsContext must be used within a ScanStatsProvider');
  }
  return context;
}; 