// ============================================
// File: components/ServiceAreaSection.tsx
// Service Area Component with customizable colors
// ============================================

"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { GoogleMap, Marker, Circle } from "@react-google-maps/api";
import { MapPin, Navigation, Loader2, Search, Globe } from "lucide-react";

interface ServiceAreaSectionProps {
	title: string;
	center: string;
	radius: number;
	onCenterChange: (center: string) => void;
	onRadiusChange: (radius: number) => void;
	isLoaded: boolean;
	loadError?: Error;
	defaultCenter: { lat: number; lng: number };
	colorTheme?: 'green' | 'pink'; // New prop
}

const SAUDI_ARABIA_BOUNDS = {
	north: 32.154284,
	south: 16.379528,
	east: 55.666584,
	west: 34.495693,
	center: { lat: 23.8859, lng: 45.0792 },
};

export const ServiceAreaSection: React.FC<ServiceAreaSectionProps> = ({
	title,
	center,
	radius,
	onCenterChange,
	onRadiusChange,
	isLoaded,
	loadError,
	defaultCenter,
	colorTheme = 'green',
}) => {
	const [locationAddress, setLocationAddress] = useState<string>("");
	const [isLoadingAddress, setIsLoadingAddress] = useState(false);
	const [isSaudiArabiaMode, setIsSaudiArabiaMode] = useState(center === "saudi_arabia");
	
	const mapRef = useRef<google.maps.Map | null>(null);
	const circleRef = useRef<google.maps.Circle | null>(null);
	const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	// Color classes based on theme
	const colors = {
		primary: colorTheme === 'pink' ? 'text-pink-600' : 'text-green-600',
		primaryBg: colorTheme === 'pink' ? 'bg-pink-600' : 'bg-green-600',
		primaryBgLight: colorTheme === 'pink' ? 'bg-pink-50' : 'bg-green-50',
		primaryBgMedium: colorTheme === 'pink' ? 'bg-pink-100' : 'bg-green-100',
		primaryBorder: colorTheme === 'pink' ? 'border-pink-200' : 'border-green-200',
		primaryBorder2: colorTheme === 'pink' ? 'border-2 border-pink-200' : 'border-2 border-green-200',
		primaryBorderSingle: colorTheme === 'pink' ? 'border-pink-500' : 'border-green-500',
		primaryText: colorTheme === 'pink' ? 'text-pink-800' : 'text-green-800',
		primaryTextMedium: colorTheme === 'pink' ? 'text-pink-700' : 'text-green-700',
		primaryTextLight: colorTheme === 'pink' ? 'text-pink-600/70' : 'text-green-600/70',
		primaryHover: colorTheme === 'pink' ? 'hover:border-pink-400' : 'hover:border-green-400',
		primaryHoverBg: colorTheme === 'pink' ? 'hover:bg-pink-200' : 'hover:bg-gray-200',
		primaryRing: colorTheme === 'pink' ? 'focus:ring-pink-500' : 'focus:ring-green-500',
		primaryAccent: colorTheme === 'pink' ? 'accent-pink-500' : 'accent-green-600',
		spinnerColor: colorTheme === 'pink' ? 'text-pink-600' : 'text-green-600',
		circleFillColor: colorTheme === 'pink' ? '#EC4899' : '#10B981',
		markerColor: colorTheme === 'pink' ? '#EC4899' : '#10B981',
	};

	const getCoordinates = useCallback(() => {
		if (center === "saudi_arabia") {
			return SAUDI_ARABIA_BOUNDS.center;
		}
		if (center) {
			const [lat, lng] = center.split(",").map(parseFloat);
			if (!isNaN(lat) && !isNaN(lng)) {
				return { lat, lng };
			}
		}
		return defaultCenter;
	}, [center, defaultCenter]);

	const currentCenter = getCoordinates();

	useEffect(() => {
		if (isSaudiArabiaMode || !searchInputRef.current || typeof google === 'undefined') return;

		try {
			const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
				componentRestrictions: { country: 'sa' },
				fields: ['formatted_address', 'geometry', 'name'],
				types: ['geocode', 'establishment'],
			});

			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();
				
				if (!place.geometry || !place.geometry.location) {
					alert('لم يتم العثور على الموقع. يرجى المحاولة مرة أخرى.');
					return;
				}

				const lat = place.geometry.location.lat();
				const lng = place.geometry.location.lng();
				const centerString = `${lat},${lng}`;
				
				onCenterChange(centerString);
				setIsSaudiArabiaMode(false);

				if (mapRef.current) {
					mapRef.current.panTo({ lat, lng });
					mapRef.current.setZoom(12);
				}
			});

			autocompleteRef.current = autocomplete;
		} catch (error) {
			console.error('Error initializing autocomplete:', error);
		}

		return () => {
			if (autocompleteRef.current) {
				google.maps.event.clearInstanceListeners(autocompleteRef.current);
			}
		};
	}, [isLoaded, onCenterChange, isSaudiArabiaMode]);

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
		if (center === "saudi_arabia") {
			setLocationAddress("جميع مناطق المملكة العربية السعودية");
			setIsLoadingAddress(false);
			return;
		}

		if (center && isLoaded) {
			const coords = getCoordinates();
			reverseGeocode(coords.lat, coords.lng);
			
			if (mapRef.current) {
				mapRef.current.panTo(coords);
			}
		}
	}, [center, isLoaded, getCoordinates, reverseGeocode]);

	const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
		if (isSaudiArabiaMode) return;
		
		if (e.latLng) {
			const lat = e.latLng.lat();
			const lng = e.latLng.lng();
			const centerString = `${lat},${lng}`;
			onCenterChange(centerString);
			setIsSaudiArabiaMode(false);
		}
	}, [onCenterChange, isSaudiArabiaMode]);

	const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
		if (e.latLng) {
			const lat = e.latLng.lat();
			const lng = e.latLng.lng();
			const centerString = `${lat},${lng}`;
			onCenterChange(centerString);
			setIsSaudiArabiaMode(false);
		}
	}, [onCenterChange]);

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
				const centerString = `${lat},${lng}`;
				
				onCenterChange(centerString);
				setIsSaudiArabiaMode(false);

				if (mapRef.current) {
					mapRef.current.panTo({ lat, lng });
					mapRef.current.setZoom(12);
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
	}, [onCenterChange]);

	const handleSelectSaudiArabia = useCallback(() => {
		setIsSaudiArabiaMode(true);
		onCenterChange("saudi_arabia");
		onRadiusChange(0);

		if (mapRef.current) {
			const bounds = new google.maps.LatLngBounds(
				{ lat: SAUDI_ARABIA_BOUNDS.south, lng: SAUDI_ARABIA_BOUNDS.west },
				{ lat: SAUDI_ARABIA_BOUNDS.north, lng: SAUDI_ARABIA_BOUNDS.east }
			);
			mapRef.current.fitBounds(bounds);
		}
	}, [onCenterChange, onRadiusChange]);

	const onMapLoad = useCallback((map: google.maps.Map) => {
		mapRef.current = map;
	}, []);

	const onCircleLoad = useCallback((circle: google.maps.Circle) => {
		circleRef.current = circle;
	}, []);

	const radiusOptions = [1, 2, 3, 5, 10, 15, 20, 25, 30, 50];

	if (!isLoaded) {
		return (
			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-gray-900">
					{title}
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
					{title}
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
				{title}
			</h3>

			{/* Coverage Type Selection */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<button
					type="button"
					onClick={handleSelectSaudiArabia}
					className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
						isSaudiArabiaMode
							? `${colors.primaryBorderSingle} ${colors.primaryBgLight}`
							: `border-gray-300 ${colors.primaryHover}`
					}`}
				>
					<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
						isSaudiArabiaMode 
							? colors.primaryBgMedium
							: 'bg-gray-100'
					}`}>
						<Globe className={`w-5 h-5 ${
							isSaudiArabiaMode 
								? colors.primary
								: 'text-gray-600'
						}`} />
					</div>
					<div className="flex-1 text-right">
						<p className={`font-semibold text-sm ${
							isSaudiArabiaMode 
								? colors.primaryTextMedium
								: 'text-gray-700'
						}`}>
							جميع مناطق المملكة
						</p>
						<p className="text-xs text-gray-500">
							تغطية كاملة
						</p>
					</div>
					{isSaudiArabiaMode && (
						<div className={`w-5 h-5 ${colors.primaryBg} rounded-full flex items-center justify-center`}>
							<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
							</svg>
						</div>
					)}
				</button>

				<button
					type="button"
					onClick={() => {
						setIsSaudiArabiaMode(false);
						if (center === "saudi_arabia") {
							onCenterChange(`${defaultCenter.lat},${defaultCenter.lng}`);
							onRadiusChange(5);
						}
					}}
					className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
						!isSaudiArabiaMode
							? `${colors.primaryBorderSingle} ${colors.primaryBgLight}`
							: `border-gray-300 ${colors.primaryHover}`
					}`}
				>
					<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
						!isSaudiArabiaMode 
							? colors.primaryBgMedium
							: 'bg-gray-100'
					}`}>
						<MapPin className={`w-5 h-5 ${
							!isSaudiArabiaMode 
								? colors.primary
								: 'text-gray-600'
						}`} />
					</div>
					<div className="flex-1 text-right">
						<p className={`font-semibold text-sm ${
							!isSaudiArabiaMode 
								? colors.primaryTextMedium
								: 'text-gray-700'
						}`}>
							منطقة محددة
						</p>
						<p className="text-xs text-gray-500">
							حدد النطاق
						</p>
					</div>
					{!isSaudiArabiaMode && (
						<div className={`w-5 h-5 ${colors.primaryBg} rounded-full flex items-center justify-center`}>
							<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
							</svg>
						</div>
					)}
				</button>
			</div>

			{/* Search Box */}
			{!isSaudiArabiaMode && (
				<div className="relative">
					<div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
						<Search className="w-5 h-5 text-gray-400" />
					</div>
					<input
						ref={searchInputRef}
						type="text"
						placeholder="ابحث عن مدينة أو منطقة..."
						className={`w-full pr-12 pl-4 py-3 border-2 border-gray-300 bg-white text-gray-900 rounded-xl focus:${colors.primaryBorderSingle} focus:ring-2 ${colors.primaryRing}/20 focus:outline-none text-right text-sm`}
						dir="rtl"
					/>
				</div>
			)}

			{/* Radius Selector */}
			{!isSaudiArabiaMode && (
				<div className={`bg-white ${colors.primaryBorder2} rounded-xl p-4 shadow-sm`}>
					<label className="block text-sm font-semibold text-gray-700 mb-3 text-right" dir="rtl">
						نصف قطر منطقة الخدمة (كيلومتر)
					</label>
					<div className="flex flex-wrap gap-2 mb-3">
						{radiusOptions.map((option) => (
							<button
								key={option}
								type="button"
								onClick={() => onRadiusChange(option)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
									radius === option
										? `${colors.primaryBg} text-white shadow-md`
										: `bg-gray-100 text-gray-700 ${colors.primaryHoverBg}`
								}`}
							>
								{option} كم
							</button>
						))}
					</div>
					<div className="flex items-center gap-4">
						<input
							type="range"
							min="1"
							max="50"
							value={radius}
							onChange={(e) => onRadiusChange(parseInt(e.target.value))}
							className={`flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${colors.primaryAccent}`}
						/>
						<span className={`text-sm font-bold ${colors.primary} min-w-[60px] text-left`}>
							{radius} كم
						</span>
					</div>
				</div>
			)}

			{/* Map Container */}
			<div className="relative h-[400px] sm:h-[450px] overflow-hidden rounded-xl border-2 border-gray-300 shadow-xl hover:shadow-2xl transition-shadow">
				{!isSaudiArabiaMode && (
					<button
						type="button"
						onClick={handleGetCurrentLocation}
						disabled={isLoadingAddress}
						className={`absolute top-4 left-4 z-10 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 ${colors.primaryRing} focus:ring-offset-2 border-2 border-gray-200 group`}
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
				)}

				<GoogleMap
					mapContainerStyle={{ width: "100%", height: "100%" }}
					center={currentCenter}
					zoom={isSaudiArabiaMode ? 6 : (radius > 10 ? 10 : radius > 5 ? 11 : 12)}
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
						restriction: {
							latLngBounds: {
								north: SAUDI_ARABIA_BOUNDS.north,
								south: SAUDI_ARABIA_BOUNDS.south,
								east: SAUDI_ARABIA_BOUNDS.east,
								west: SAUDI_ARABIA_BOUNDS.west,
							},
							strictBounds: false,
						},
					}}
					onClick={handleMapClick}
				>
					{!isSaudiArabiaMode && (
						<Circle
							center={currentCenter}
							radius={radius * 1000}
							onLoad={onCircleLoad}
							options={{
								fillColor: colors.circleFillColor,
								fillOpacity: 0.2,
								strokeColor: colors.circleFillColor,
								strokeOpacity: 0.8,
								strokeWeight: 2,
								clickable: false,
								zIndex: 1,
							}}
						/>
					)}

					{!isSaudiArabiaMode && (
						<Marker
							position={currentCenter}
							draggable={true}
							onDragEnd={handleMarkerDragEnd}
							animation={google.maps.Animation.DROP}
							title="اسحب العلامة لتغيير مركز منطقة الخدمة"
							icon={{
								url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
									<svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M20 0C8.972 0 0 8.972 0 20C0 35 20 48 20 48C20 48 40 35 40 20C40 8.972 31.028 0 20 0Z" fill="${colors.markerColor}"/>
										<circle cx="20" cy="20" r="8" fill="white"/>
										<circle cx="20" cy="20" r="4" fill="${colors.markerColor}"/>
									</svg>
								`),
								scaledSize: new google.maps.Size(40, 48),
								anchor: new google.maps.Point(20, 48),
							}}
						/>
					)}
				</GoogleMap>
			</div>

			{/* Selected Area Display */}
			<div className={`${colors.primaryBgLight} ${colors.primaryBorder2} rounded-xl p-4 shadow-sm`}>
				<div className="flex items-start gap-3">
					<div className={`w-10 h-10 rounded-lg ${colors.primaryBgMedium} flex items-center justify-center flex-shrink-0`}>
						{isSaudiArabiaMode ? (
							<Globe className={`w-5 h-5 ${colors.primary}`} />
						) : (
							<MapPin className={`w-5 h-5 ${colors.primary}`} />
						)}
					</div>
					<div className="flex-1 min-w-0">
						<p className={`text-sm font-bold ${colors.primaryText} mb-2`}>
							✓ منطقة الخدمة المحددة:
						</p>
						{isLoadingAddress ? (
							<div className="flex items-center gap-2">
								<Loader2 className={`w-4 h-4 animate-spin ${colors.primary}`} />
								<p className={`text-sm ${colors.primaryTextMedium}`}>
									جاري تحميل العنوان...
								</p>
							</div>
						) : (
							<>
								<p className={`text-sm ${colors.primaryTextMedium} text-right mb-2 leading-relaxed`} dir="rtl">
									{locationAddress}
								</p>
								{!isSaudiArabiaMode && (
									<div className={`flex items-center gap-4 text-xs ${colors.primaryTextLight}`}>
										<span className="font-mono">
											{currentCenter.lat.toFixed(6)}, {currentCenter.lng.toFixed(6)}
										</span>
										<span className="font-semibold">
											نصف القطر: {radius} كم
										</span>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};