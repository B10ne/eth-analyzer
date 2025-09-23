import { useState, useEffect } from 'react';
import { fetchChartUpdateData } from '@/lib/apiClient';
import { ChartUpdateDataPoint } from '@/types/api';

export function useChartUpdater(refreshInterval: number = 60000) { // 1 menit
  const [chartData, setChartData] = useState<ChartUpdateDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      fetchChartUpdateData()
        .then(setChartData)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    };

    fetchData(); // Panggil pertama kali
    const intervalId = setInterval(fetchData, refreshInterval); // Atur pembaruan

    return () => clearInterval(intervalId); // Cleanup
  }, [refreshInterval]);

  return { chartData, loading, error };
}