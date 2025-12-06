"use client";

/**
 * Hook for Google Maps functionality in kaidha registration
 */

import { useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { KAIDHA_CONSTANTS, KAIDHA_MAP_LIBRARIES } from "../constants/kaidha.constants";

export function useKaidhaMap() {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: KAIDHA_CONSTANTS.GOOGLE_MAPS_API_KEY,
		libraries: KAIDHA_MAP_LIBRARIES as ['places'],
	});

	// Check for Google Maps API key
	useEffect(() => {
		if (!KAIDHA_CONSTANTS.GOOGLE_MAPS_API_KEY) {
			console.warn("Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file");
		}
	}, []);

	return {
		isLoaded,
		loadError,
	};
}

