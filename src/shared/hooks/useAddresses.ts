"use client";

import { useState, useEffect, useCallback } from "react";
import { cache } from "react";
import { BASE_URL } from "@/features/auth/constants/auth.constants";
import { getCookie } from "@/features/auth/lib/utils/cookie.utils";

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

// Cached fetch function using React's cache
const getCachedAddresses = cache(
	async (apiUrl: string, token: string) => {
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			// Next.js fetch caching with increased time (15 minutes = 900 seconds)
			next: {
				revalidate: 900, // Re-fetch every 15 minutes
				tags: [`addresses-${token?.substring(0, 10) || 'no-token'}`], // For on-demand revalidation
			},
		});

		if (!response.ok) {
			console.error('[Addresses] API Error:', response.status);
			return null;
		}

		const data = await response.json() as AddressesData;
		return data;
	}
);

export function useAddresses(initialPage: number = 1, initialLimit: number = 10, token: string) {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [totalSize, setTotalSize] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(initialPage);
	const [limit] = useState(initialLimit);
	
	// Fetch addresses
	const fetchAddresses = useCallback(async (currentPage: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const apiUrl = `https://shellafood.com/api/v1/customer/address/list?limit=${limit}&offset=${currentPage}`;
			
			// Use cached fetch function
			const data = await getCachedAddresses(apiUrl, token);
			
			if (!data) {
				setError('Failed to fetch addresses');
				return;
			}
			
			console.log("data", data);
			setAddresses(data.addresses);
			setTotalSize(data.total_size);
			setCurrentPage(currentPage);
		} catch (error) {
			console.error('[Addresses] Fetch Error:', error);
			setError(error instanceof Error ? error.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}

	}, [limit, token]);


	// Add new address
	const addAddress = useCallback(async (addressData: AddAddressPayload) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!token) throw new Error('No authentication token');

			const response = await fetch(`https://shellafood.com/api/v1/customer/address/add`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify(addressData),
			});
			console.log("response in addAddress", response)

			const result = await response.json();
			console.log("result in addAddress", result)
			
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			console.log('Error adding address:', err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, fetchAddresses]);

	// Update existing address
	const updateAddress = useCallback(async (addressId: number, addressData: UpdateAddressPayload) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!token) throw new Error('No authentication token');

			const response = await fetch(`${BASE_URL}/api/v1/customer/address/update/${addressId}`, {
				method: 'PUT',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'x-localization': 'ar',
				},
				body: JSON.stringify(addressData),
			});

			
			const result = await response.json();
			
		console.log("result", result)
			
			return result;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
			console.error('Error updating address:', err);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [currentPage, fetchAddresses]);

	// Delete address
	const deleteAddress = useCallback(async (addressId: number) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!token) throw new Error('No authentication token');

			const response = await fetch(
				`${BASE_URL}/api/v1/customer/address/delete?address_id=${addressId}`,
				{
					method: 'DELETE',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
						'Accept': 'application/json',
					},
				}
			);

			if (!response.ok) {
				throw new Error('Failed to delete address');
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
	}, [currentPage, fetchAddresses]);

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