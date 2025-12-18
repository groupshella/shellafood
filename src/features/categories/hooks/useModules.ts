'use client';

import useSWR from 'swr';
import { Module } from '../types/module.types';

const fetcher = (url: string) => fetch(url).then(r => {
	if (!r.ok) {
		throw new Error('Failed to fetch modules');
	}
	return r.json();
});

export function useModules(
	latitude: number,
	longitude: number,
	locale: string
) {
	const { data, error, isLoading, mutate } = useSWR<Module[]>(
		`/api/modules?lat=${latitude}&lng=${longitude}&locale=${locale}`,
		fetcher,
		{
			revalidateOnFocus: false,
      revalidateOnMount: false,
			revalidateOnReconnect: true,
			dedupingInterval: 60000, // ✅ Prevent duplicate requests
			errorRetryCount: 3,
			errorRetryInterval: 5000,
			keepPreviousData: true, // ✅ Keep old data while fetching new
		}
	);

	return {
		modules: data || [],
		loading: isLoading,
		error,
		refresh: mutate,
	};
}