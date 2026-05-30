'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Address } from '../types/cart.types';
import { fetchAddresses, saveAddress, deleteAddress, type AddressSaveData } from '../lib/services/address.service';

export interface UseAddressReturn {
	addresses: Address[];
	selectedAddressId: string | null;
	isLoading: boolean;
	error: string | null;
	selectAddress: (addressId: string) => void;
	saveNewAddress: (addressData: AddressSaveData) => Promise<boolean>;
	deleteAddressById: (addressId: string) => Promise<boolean>;
	refetchAddresses: () => Promise<void>;
	clearError: () => void;
}

export function useAddress(language: 'en' | 'ar' = 'ar'): UseAddressReturn {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadAddresses = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const fetchedAddresses = await fetchAddresses();
			setAddresses(fetchedAddresses);
			
			// Auto-select first address if available and none selected
			if (fetchedAddresses.length > 0 && !selectedAddressId) {
				setSelectedAddressId(fetchedAddresses[0].id.toString());
			}
		} catch (err) {
			setError('Failed to load addresses');
			console.error('Error loading addresses:', err);
		} finally {
			setIsLoading(false);
		}
	}, [selectedAddressId]);

	useEffect(() => {
		loadAddresses();
	}, [loadAddresses]);

	const selectAddress = useCallback((addressId: string) => {
		const addressExists = addresses.some(a => a.id.toString() === addressId);
		if (addressExists) {
			setSelectedAddressId(addressId);
		}
	}, [addresses]);

	const saveNewAddress = useCallback(async (addressData: AddressSaveData): Promise<boolean> => {
		setError(null);

		try {
			const result = await saveAddress(addressData);
			
			if (result.success) {
				await loadAddresses();
				return true;
			}

			setError('Failed to save address');
			return false;
		} catch (err) {
			setError('An error occurred while saving address');
			console.error('Error saving address:', err);
			return false;
		}
	}, [loadAddresses]);

	const deleteAddressById = useCallback(async (addressId: string): Promise<boolean> => {
		setError(null);

		try {
			const result = await deleteAddress(addressId);
			
			if (result.success) {
				// Remove from local state
				setAddresses(prev => prev.filter(a => a.id.toString() !== addressId));
				
				// If deleted address was selected, select another one
				if (selectedAddressId === addressId) {
					const remaining = addresses.filter(a => a.id.toString() !== addressId);
					if (remaining.length > 0) {
						setSelectedAddressId(remaining[0].id.toString());
					} else {
						setSelectedAddressId(null);
					}
				}
				
				return true;
			}

			setError('Failed to delete address');
			return false;
		} catch (err) {
			setError('An error occurred while deleting address');
			console.error('Error deleting address:', err);
			return false;
		}
	}, [addresses, selectedAddressId]);

	const refetchAddresses = useCallback(async () => {
		await loadAddresses();
	}, [loadAddresses]);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		addresses,
		selectedAddressId,
		isLoading,
		error,
		selectAddress,
		saveNewAddress,
		deleteAddressById,
		refetchAddresses,
		clearError,
	};
}
