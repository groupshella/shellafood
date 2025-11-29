// Hook for address management

import { useState, useEffect, useCallback } from 'react';
import { Address } from '../types/address.types';
import { reverseGeocode } from '@/lib/maps/utils';

/**
 * Hook for address management
 */
export const useAddress = (language: 'en' | 'ar' = 'en') => {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const isArabic = language === 'ar';

	// Fetch addresses (mock implementation)
	const fetchAddresses = useCallback(async () => {
		setIsLoading(true);
		try {
			// Mock API call
			const result = {
				success: true,
				data: { addresses: [] },
				error: '',
			};

			if (!result.success) {
				console.error('Failed to fetch addresses:', result.error);
				return;
			}

			const addressesData = result.data?.addresses || [];

			const transformedAddresses: Address[] = addressesData.map((addr: any) => {
				try {
					const [lat, lng] = addr.address.split(',').map(Number);
					if (!isNaN(lat) && !isNaN(lng)) {
						return {
							...addr,
							lat,
							lng,
							formattedAddress: addr.formattedAddress || addr.address,
						};
					}
					return {
						...addr,
						formattedAddress: addr.address,
					};
				} catch {
					return {
						...addr,
						formattedAddress: addr.address,
					};
				}
			});

			setAddresses(transformedAddresses);

			// Auto-select first address if available
			if (transformedAddresses.length > 0 && !selectedAddressId) {
				const firstAddr = transformedAddresses[0];
				setSelectedAddressId(firstAddr.id);

				// Reverse geocode if needed
				if (firstAddr.lat && firstAddr.lng && !firstAddr.formattedAddress) {
					try {
						const { address } = await reverseGeocode(firstAddr.lat, firstAddr.lng, isArabic ? 'ar' : 'en');
						const updated = { ...firstAddr, formattedAddress: address };
						setAddresses((prev) =>
							prev.map((a) => (a.id === firstAddr.id ? updated : a))
						);
					} catch (error) {
						console.error('Error geocoding address:', error);
					}
				}
			}
		} catch (error) {
			console.error('Error fetching addresses:', error);
		} finally {
			setIsLoading(false);
		}
	}, [selectedAddressId, isArabic]);

	useEffect(() => {
		fetchAddresses();
	}, [fetchAddresses]);

	const selectAddress = useCallback((addressId: string) => {
		setSelectedAddressId(addressId);
	}, []);

	return {
		addresses,
		selectedAddressId,
		isLoading,
		selectAddress,
		refetchAddresses: fetchAddresses,
	};
};

