"use client";

/**
 * Hook for Google Maps functionality in partner registration
 */

import { useRef, useMemo } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { PARTNER_CONSTANTS, PARTNER_MAP_LIBRARIES } from "../constants/partner.constants";
import type { PartnerFormData } from "../types/partner.types";
import type { NotificationState } from "../types/partner.types";

interface UsePartnerMapProps {
	formData: PartnerFormData;
	setFormData: React.Dispatch<React.SetStateAction<PartnerFormData>>;
	setNotification: React.Dispatch<React.SetStateAction<NotificationState>>;
	t: (key: string) => string;
}

export function usePartnerMap({
	formData,
	setFormData,
	setNotification,
	t,
}: UsePartnerMapProps) {
	const { isLoaded } = useLoadScript({
		googleMapsApiKey: PARTNER_CONSTANTS.GOOGLE_MAPS_API_KEY,
		libraries: PARTNER_MAP_LIBRARIES as ['places'],
	});
	
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

	const handlePlaceChanged = () => {
		const place = autocompleteRef.current?.getPlace();
		if (place?.geometry?.location) {
			const lat = place.geometry.location.lat();
			const lng = place.geometry.location.lng();
			const address = place.formatted_address || place.name || "";
			setFormData((prev) => ({
				...prev,
				latitude: lat.toString(),
				longitude: lng.toString(),
				address: address,
			}));
		}
	};

	const handleLocationClick = (e: google.maps.MapMouseEvent) => {
		if (e.latLng) {
			const lat = e.latLng.lat().toString();
			const lng = e.latLng.lng().toString();
			setFormData((prev) => ({
				...prev,
				latitude: lat,
				longitude: lng,
			}));
		}
	};

	const handleGetCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const lat = pos.coords.latitude.toString();
					const lng = pos.coords.longitude.toString();
					setFormData((prev) => ({
						...prev,
						latitude: lat,
						longitude: lng,
					}));
				},
				() => {
					setNotification({
						message: t("partnerForm.locationError"),
						type: "error",
						isVisible: true,
					});
				},
			);
		} else {
			setNotification({
				message: t("partnerForm.locationNotSupported"),
				type: "error",
				isVisible: true,
			});
		}
	};

	const mapCenter = useMemo(() => {
		return formData.latitude && formData.longitude
			? {
					lat: parseFloat(formData.latitude),
					lng: parseFloat(formData.longitude),
				}
			: PARTNER_CONSTANTS.DEFAULT_CENTER;
	}, [formData.latitude, formData.longitude]);

	const markerPosition = useMemo(() => {
		return formData.latitude && formData.longitude
			? {
					lat: parseFloat(formData.latitude),
					lng: parseFloat(formData.longitude),
				}
			: null;
	}, [formData.latitude, formData.longitude]);

	return {
		isLoaded,
		autocompleteRef,
		handlePlaceChanged,
		handleLocationClick,
		handleGetCurrentLocation,
		mapCenter,
		markerPosition,
	};
}

