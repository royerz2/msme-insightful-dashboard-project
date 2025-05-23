
import { useState, useEffect } from 'react';
import { fetchWithErrorHandling } from '../utils/api';
import { ApiResponse } from '../types';
import { toast } from 'sonner';
import { getDummyData } from '../utils/dummyData';

export const useApiData = <T>(endpoint: string): ApiResponse<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useDummyData, setUseDummyData] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchWithErrorHandling<T>(endpoint);
        setData(result);
        setUseDummyData(false);
      } catch (err) {
        // Show error message but continue with dummy data
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        toast.error(`API Error: ${errorMessage}. Using demo data instead.`);
        
        // Get dummy data for this endpoint
        const dummyData = getDummyData<T>(endpoint);
        setData(dummyData);
        setUseDummyData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error, useDummyData };
};
