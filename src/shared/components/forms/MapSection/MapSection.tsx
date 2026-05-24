// ============================================
// File: components/MapSection.tsx
// Map Component with customizable colors
// ============================================

"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin, Navigation, Loader2 } from "lucide-react";

interface MapSectionProps {
	title: string;
	location: string;
	onLocationChange: (location: string) => void;
	isLoaded: boolean;
	loadError?: Error;
	defaultCenter: { lat: number; lng: number };
	colorTheme?: 'green' | 'pink'; // New prop for color theme
}

export const MapSection: React.FC<MapSectionProps> = ({
	title,
	location,
	onLocationChange,
	isLoaded,
	loadError,
	defaultCenter,
	colorTheme = 'green', // Default to green
}) => {
	const [locationAddress, setLocationAddress] = useState<string>("");
	const [isLoadingAddress, setIsLoadingAddress] = useState(false);
	const mapRef = useRef<google.maps.Map | null>(null);
	const previousLocationRef = useRef<string>("");

	// Color classes based on theme
	const colors = {
		primary: colorTheme === 'pink' ? 'text-pink-600' : 'text-green-600',
		primaryBg: colorTheme === 'pink' ? 'bg-pink-600' : 'bg-green-600',
		primaryBgLight: colorTheme === 'pink' ? 'bg-pink-50' : 'bg-green-50',
		primaryBgMedium: colorTheme === 'pink' ? 'bg-pink-100' : 'bg-green-100',
		primaryBorder: colorTheme === 'pink' ? 'border-pink-200' : 'border-green-200',
		primaryBorder2: colorTheme === 'pink' ? 'border-2 border-pink-200' : 'border-2 border-green-200',
		primaryText: colorTheme === 'pink' ? 'text-pink-800' : 'text-green-800',
		primaryTextLight: colorTheme === 'pink' ? 'text-pink-700' : 'text-green-700',
		primaryTextVeryLight: colorTheme === 'pink' ? 'text-pink-600/70' : 'text-green-600/70',
		primaryHover: colorTheme === 'pink' ? 'hover:bg-pink-50' : 'hover:bg-gray-50',
		primaryRing: colorTheme === 'pink' ? 'focus:ring-pink-500' : 'focus:ring-green-500',
		spinnerColor: colorTheme === 'pink' ? 'text-pink-600' : 'text-green-600',
	};

	const getCoordinates = useCallback((loc: string) => {
		if (loc) {
			const [lat, lng] = loc.split(",").map(parseFloat);
			if (!isNaN(lat) && !isNaN(lng)) {
				return { lat, lng };
			}
		}
		return defaultCenter;
	}, [defaultCenter]);

	const reverseGeocode = useCallback(async (lat: number, lng: number) => {
		if (typeof google === 'undefined') return;

		setIsLoadingAddress(true);

		try {
			const geocoder = new google.maps.Geocoder();
			const response = await geocoder.geocode({
				location: { lat, lng },
				language: 'ar',
			});

			if (response.results && response.results[0]) {
				const address = response.results[0].formatted_address;
				setLocationAddress(address);
			} else {
				setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
			}
		} catch (error) {
			console.error("Reverse geocoding error:", error);
			setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
		} finally {
			setIsLoadingAddress(false);
		}
	}, []);

	useEffect(() => {
		if (location && location !== previousLocationRef.current && isLoaded) {
			previousLocationRef.current = location;

			const coords = getCoordinates(location);
			reverseGeocode(coords.lat, coords.lng);

			if (mapRef.current) {
				mapRef.current.panTo(coords);
			}
		}
	}, [location, isLoaded]);

	const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
		if (e.latLng) {
			const lat = e.latLng.lat();
			const lng = e.latLng.lng();
			const locationString = `${lat},${lng}`;

			onLocationChange(locationString);
		}
	}, [onLocationChange]);

	const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
		if (e.latLng) {
			const lat = e.latLng.lat();
			const lng = e.latLng.lng();
			const locationString = `${lat},${lng}`;

			onLocationChange(locationString);
		}
	}, [onLocationChange]);

	const handleGetCurrentLocation = useCallback(() => {
		if (!navigator.geolocation) {
			alert("الموقع الحالي غير مدعوم في متصفحك");
			return;
		}

		setIsLoadingAddress(true);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				const locationString = `${lat},${lng}`;

				onLocationChange(locationString);

				if (mapRef.current) {
					mapRef.current.panTo({ lat, lng });
					mapRef.current.setZoom(16);
				}
			},
			(error) => {
				console.error("Geolocation error:", error);
				alert("خطأ في الحصول على الموقع الحالي. يرجى التأكد من السماح بالوصول للموقع.");
				setIsLoadingAddress(false);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);
	}, [onLocationChange]);

	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
	}, []);

	const currentPosition = getCoordinates(location);

	// Marker color based on theme
	const markerColor = colorTheme === 'pink' ? '#EC4899' : '#10B981';

	if (!isLoaded) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-gray-900">
					{title} <span className="text-red-500">*</span>
				</h3>
				<div className="relative h-[400px] rounded-xl border-2 border-gray-300 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
					<div className="flex h-full items-center justify-center">
						<div className="text-center">
							<Loader2 className={`mx-auto h-12 w-12 animate-spin ${colors.spinnerColor}`} />
							<p className="mt-4 text-base font-medium text-gray-700">
								جاري تحميل الخريطة...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (loadError) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-gray-900">
					{title} <span className="text-red-500">*</span>
				</h3>
				<div className="relative h-[400px] rounded-xl border-2 border-red-300 shadow-lg bg-red-50">
					<div className="flex h-full items-center justify-center p-6">
						<div className="text-center max-w-md">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
								</svg>
							</div>
							<h3 className="text-lg font-semibold text-red-900 mb-2">
								خطأ في تحميل الخريطة
							</h3>
							<p className="text-sm text-red-700 mb-3">
								يرجى التأكد من إضافة مفتاح Google Maps API
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold text-gray-900">
				{title} <span className="text-red-500">*</span>
			</h3>

			<div className={`${colorTheme === 'pink' ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200' : 'bg-blue-50 border border-blue-200'} rounded-lg p-4`}>
				<p className={`text-sm ${colorTheme === 'pink' ? 'text-pink-800' : 'text-blue-800'} text-right`} dir="rtl">
					💡 انقر على الخريطة أو اسحب العلامة لتحديد الموقع بدقة
				</p>
			</div>

			<div className="relative h-[400px] sm:h-[450px] overflow-hidden rounded-xl border-2 border-gray-300 shadow-xl hover:shadow-2xl transition-shadow">
				<button
					type="button"
					onClick={handleGetCurrentLocation}
					disabled={isLoadingAddress}
					className={`absolute top-4 left-4 z-10 rounded-xl bg-white ${colors.primaryHover} disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 ${colors.primaryRing} focus:ring-offset-2 border-2 border-gray-200 group`}
					title="استخدام الموقع الحالي"
				>
					<div className="flex items-center gap-2">
						{isLoadingAddress ? (
							<Loader2 className={`h-5 w-5 animate-spin ${colors.primary}`} />
						) : (
							<Navigation className={`h-5 w-5 ${colors.primary} group-hover:scale-110 transition-transform`} />
						)}
						<span className="hidden sm:inline text-sm font-semibold text-gray-700">
							الموقع الحالي
						</span>
					</div>
				</button>

				<GoogleMap
					mapContainerStyle={{ width: "100%", height: "100%" }}
					center={currentPosition}
					zoom={14}
					onLoad={onMapLoad}
					options={{
						zoomControl: true,
						zoomControlOptions: {
							position: google.maps.ControlPosition.RIGHT_CENTER,
						},
						streetViewControl: false,
						mapTypeControl: false,
						fullscreenControl: true,
						fullscreenControlOptions: {
							position: google.maps.ControlPosition.RIGHT_TOP,
						},
						clickableIcons: false,
						gestureHandling: "greedy",
						styles: [
							{
								featureType: "poi",
								elementType: "labels",
								stylers: [{ visibility: "off" }],
							},
						],
					}}
					onClick={handleMapClick}
				>
					<Marker
						position={currentPosition}
						draggable={true}
						onDragEnd={handleMarkerDragEnd}
						animation={google.maps.Animation.DROP}
						title="اسحب العلامة لتغيير الموقع"
						icon={{
							url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
								<svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M20 0C8.972 0 0 8.972 0 20C0 35 20 48 20 48C20 48 40 35 40 20C40 8.972 31.028 0 20 0Z" fill="${markerColor}"/>
									<circle cx="20" cy="20" r="8" fill="white"/>
								</svg>
							`),
							scaledSize: new google.maps.Size(40, 48),
							anchor: new google.maps.Point(20, 48),
						}}
					/>
				</GoogleMap>
			</div>

			{location ? (
				<div className={`${colors.primaryBgLight} ${colors.primaryBorder2} rounded-xl p-4 shadow-sm`}>
					<div className="flex items-start gap-3">
						<div className={`w-10 h-10 rounded-lg ${colors.primaryBgMedium} flex items-center justify-center flex-shrink-0`}>
							<MapPin className={`w-5 h-5 ${colors.primary}`} />
						</div>
						<div className="flex-1 min-w-0">
							<p className={`text-sm font-bold ${colors.primaryText} mb-2`}>
								✓ الموقع المحدد:
							</p>
							{isLoadingAddress ? (
								<div className="flex items-center gap-2">
									<Loader2 className={`w-4 h-4 animate-spin ${colors.primary}`} />
									<p className={`text-sm ${colors.primaryTextLight}`}>
										جاري تحميل العنوان...
									</p>
								</div>
							) : (
								<>
									<p className={`text-sm ${colors.primaryTextLight} text-right mb-2 leading-relaxed`} dir="rtl">
										{locationAddress || "جاري تحميل العنوان..."}
									</p>
									<p className={`text-xs ${colors.primaryTextVeryLight} font-mono`}>
										{currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
									</p>
								</>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
						<MapPin className="w-8 h-8 text-gray-400" />
					</div>
					<p className="text-sm font-medium text-gray-600 mb-1">
						لم يتم تحديد الموقع بعد
					</p>
					<p className="text-xs text-gray-500">
						انقر على الخريطة أو استخدم زر "الموقع الحالي"
					</p>
				</div>
			)}
		</div>
	);
};