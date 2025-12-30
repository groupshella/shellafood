"use client";

import { useState, useCallback } from "react";
import { getBaseUrl } from "@/features/auth/constants/auth.constants";

export interface Address {
	id: number;
	address_type: string;
	contact_person_number: string;
	address: string;
	latitude: string;
	longitude: string;
	user_id: number;
	contact_person_name: string;
	created_at: string;
	updated_at: string;
	zone_id: number;
	floor: string | null;
	road: string | null;
	house: string | null;
	zone_ids: number[];
}

interface AddressesData {
	total_size: number;
	limit: string;
	offset: string;
	addresses: Address[];
}

interface AddAddressPayload {
	address_type: string;
	contact_person_name: string;
	contact_person_number: string;
	address: string;
	latitude: string;
	longitude: string;
	road?: string;
	house?: string;
	floor?: string;
}

interface UpdateAddressPayload {
	address_type: string;
	contact_person_name: string;
	contact_person_number: string;
	address: string;
	latitude: string;
	longitude: string;
	zone_id?: number;
	road?: string;
	house?: string;
	floor?: string;
}

// Fetch addresses from API route
async function fetchAddressesFromApi(apiUrl: string): Promise<AddressesData | null> {
	const response = await fetch(apiUrl, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
		},
		// Note: next option only works in server components
		// Client-side caching is handled by the browser
	});

	if (!response.ok) {
		console.error('[Addresses] API Error:', response.status);
		return null;
	}

	const data = await response.json() as AddressesData;
	return data;
}

export function useAddresses(initialPage: number = 1, initialLimit: number = 10, token: string) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [totalSize, setTotalSize] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [limit] = useState(initialLimit);
	const baseUrl = getBaseUrl();
	
	// Fetch addresses
	const fetchAddresses = useCallback(async (currentPage: number) => {
		setIsLoading(true);
		setError(null);
		try {
			// ✅ Use API route as proxy
			const apiUrl = `${baseUrl}/api/addresses?limit=${limit}&offset=${currentPage}&locale=ar`;
			
			// Fetch from API route
			const data = await fetchAddressesFromApi(apiUrl);
			
			if (!data) {
				setError('Failed to fetch addresses');
				return;
			}
			
			setAddresses(data.addresses || []);
			setTotalSize(data.total_size || 0);
			setCurrentPage(currentPage);
		} catch (error) {
			console.error('[Addresses] Fetch Error:', error);
			setError(error instanceof Error ? error.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}

	}, [limit, token, baseUrl]);


	// Add new address
	const addAddress = useCallback(async (addressData: AddAddressPayload) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!token) throw new Error('No authentication token');

			// ✅ Use API route as proxy
			const response = await fetch(`${baseUrl}/api/addresses/add`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify(addressData),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to add address' }));
				throw new Error(errorData.error || 'Failed to add address');
			}

			const result = await response.json();
			
			// Refresh the list after adding
			await fetchAddresses(currentPage);
			
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			console.error('Error adding address:', err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [baseUrl, fetchAddresses, currentPage]);

	// Update existing address
	const updateAddress = useCallback(async (addressId: number, addressData: UpdateAddressPayload) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!token) throw new Error('No authentication token');

			// ✅ Use API route as proxy
			const response = await fetch(`${baseUrl}/api/addresses/update/${addressId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify(addressData),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to update address' }));
				throw new Error(errorData.error || 'Failed to update address');
			}

			const result = await response.json();
			
			// Refresh the list after updating
			await fetchAddresses(currentPage);
			
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			console.error('Error updating address:', err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [baseUrl, fetchAddresses, currentPage]);

	// Delete address
	const deleteAddress = useCallback(async (addressId: number) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!token) throw new Error('No authentication token');

			// ✅ Use API route as proxy
			const response = await fetch(
				`${baseUrl}/api/addresses/delete?address_id=${addressId}`,
				{
					method: 'DELETE',
					headers: {
						'Accept': 'application/json',
					},
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ error: 'Failed to delete address' }));
				throw new Error(errorData.error || 'Failed to delete address');
			}

			// Refresh the list
			await fetchAddresses(currentPage);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			console.error('Error deleting address:', err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [baseUrl, currentPage, fetchAddresses]);

	// Get address by ID
	const getAddressById = useCallback((addressId: number) => {
		return addresses.find(addr => addr.id === addressId) || null;
	}, [addresses]);

	// Pagination helper
	const goToPage = useCallback((page: number) => {
		fetchAddresses(page);
	}, [fetchAddresses]);

	const totalPages = Math.ceil(totalSize / limit);

	return {
		addresses,
		totalSize,
		currentPage,
		totalPages,
		limit,
		isLoading,
		error,
		addAddress,
		updateAddress,
		deleteAddress,
		getAddressById,
		fetchAddresses,
		goToPage,
	};
}