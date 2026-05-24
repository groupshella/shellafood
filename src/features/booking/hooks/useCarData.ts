'use client';

import { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

export function useCarMakes() {
  const [makes, setMakes] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMakes() {
      try {
        const res = await fetch('/api/cars/makes');
        const json = await res.json();
        
        if (json.success) {
          setMakes(json.data);
        }
      } catch (error) {
        console.error('Error fetching makes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMakes();
  }, []);

  return { makes, loading };
}

export function useCarModels(makeId: string | null) {
  const [models, setModels] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!makeId) {
      setModels([]);
      return;
    }

    async function fetchModels() {
      setLoading(true);
        console.log(makeId);
      try {
        const res = await fetch(`/api/cars/models/${makeId}?makeId=${makeId}`);
        const json = await res.json();
        console.log(json);
        
        if (json.success) {
          setModels(json.data);
        }
      } catch (error) {
        console.log(error);
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, [makeId]);

  return { models, loading };
}