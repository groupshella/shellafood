'use client';

import { useState, useEffect, useCallback } from 'react';
import { MainServiceDto, ApiResult } from '../types/serve-me.types';



// Hook for active services
export function useActiveServices() {
  const [services, setServices] = useState<MainServiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    async function fetchServices() {
      try {
        setLoading(true);
        const response = await fetch('/api/services/active');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResult<MainServiceDto[]> = await response.json();
          
        if (result.success) {
            setServices(result.data || []);
          setError(null);
        } else {
           setError(result.errors?.join(', ') || 'Failed to fetch services');
        }
      } catch (err) {
        console.error('Error fetching active services:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return { services, loading, error };
}

// Hook for search
export function useServiceSearch() {
  const [results, setResults] = useState<MainServiceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (term: string) => {
    if (!term || term.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/services/search?term=${encodeURIComponent(term)}`);


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResult<MainServiceDto[]> = await response.json();

      if (result.success) {
        setResults(result.data || []);
      } else {
        setError(result.errors?.join(', ') || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      console.error('Error searching services:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}