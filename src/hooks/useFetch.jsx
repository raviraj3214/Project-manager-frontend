import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const cache = {}; // In-memory cache to store fetched data

export default function useFetch(url, options) {
  // Initialize state with cached data if available
  const [data, setData] = useState(cache[url] || null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(!cache[url]); // Only set loading if data isn't cached

  // Fetch data with caching mechanism
  const fetchData = useCallback(async () => {
    if (cache[url]) {
      // Use cached data if available
      setData(cache[url]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(url, options);

      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.message);
      }

      const resObj = await res.json();
      cache[url] = resObj.data; // Cache the result
      setData(resObj.data);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  // Run fetchData on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading };
}
