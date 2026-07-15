"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { checkZone } from "@/features/addresses/actions/check-zone";
import { OutOfServiceArea } from "@/features/addresses/components/shared/OutOfServiceArea";
import { PickedLocation } from "@/features/addresses/types/address.types";

interface MapPickerClientProps {
	onConfirm: (location: PickedLocation) => void;
	initialPosition?: google.maps.LatLngLiteral;
}

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
	lat: Number(process.env.NEXT_PUBLIC_LATITUDE) || 24.7136,
	lng: Number(process.env.NEXT_PUBLIC_LONGITUDE) || 46.6753,
};

/** Required for AdvancedMarkerElement. Use a Cloud Console Map ID in prod. */
const MAP_ID =
	process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim() || "DEMO_MAP_ID";

const MAP_OPTIONS: google.maps.MapOptions = {
	disableDefaultUI: true,
	zoomControl: true,
	clickableIcons: false,
	gestureHandling: "greedy",
	mapId: MAP_ID,
	// Note: `styles` cannot be used together with `mapId`.
};

const GOOGLE_MAPS_LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

const GEOCODER_LANGUAGE = "ar";
const GEOCODER_REGION = "SA";

function extractAddressParts(components: google.maps.GeocoderAddressComponent[]) {
	const get = (type: string) =>
		components.find((c) => c.types.includes(type))?.long_name ?? "";

	return {
		city: get("locality") || get("administrative_area_level_1"),
		region:
			get("sublocality") ||
			get("administrative_area_level_2") ||
			get("neighborhood"),
		street_name: get("route"),
	};
}

interface GeocodedLocation extends PickedLocation {
	formattedAddress: string;
}

function reverseGeocode(lat: number, lng: number): Promise<GeocodedLocation> {
	const geocoder = new google.maps.Geocoder();

	return new Promise((resolve, reject) => {
		geocoder.geocode(
			{
				location: { lat, lng },
				language: GEOCODER_LANGUAGE,
				region: GEOCODER_REGION,
			},
			(results, status) => {
				if (status === "OK" && results?.[0]?.formatted_address) {
					const { formatted_address, address_components } = results[0];
					const { city, region, street_name } =
						extractAddressParts(address_components);

					resolve({
						lat,
						lng,
						city,
						region,
						street_name,
						formattedAddress: formatted_address,
					});
					return;
				}

				reject(new Error("تعذّر تحديد العنوان"));
			},
		);
	});
}

function formatPickedAddress(location: GeocodedLocation): string {
	if (location.formattedAddress.trim()) return location.formattedAddress.trim();

	return [location.street_name, location.region, location.city]
		.filter(Boolean)
		.join("، ");
}

function createBrandPinElement(): HTMLElement {
	const PinElement = google.maps.marker?.PinElement;
	if (PinElement) {
		const pin = new PinElement({
			background: "#30913F",
			borderColor: "#267332",
			glyphColor: "#FFFFFF",
			scale: 1.15,
		});
		return pin.element;
	}

	// Fallback pin if PinElement is unavailable
	const el = document.createElement("div");
	el.style.width = "28px";
	el.style.height = "40px";
	el.innerHTML = `
		<svg viewBox="0 0 36 44" width="28" height="40" aria-hidden="true">
			<path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#30913F"/>
			<circle cx="18" cy="18" r="6" fill="#FFFFFF"/>
		</svg>
	`;
	return el;
}

/** AdvancedMarkerElement wrapper — replaces deprecated google.maps.Marker. */
function AdvancedMapMarker({
	map,
	position,
}: {
	map: google.maps.Map | null;
	position: google.maps.LatLngLiteral;
}) {
	const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
		null,
	);

	useEffect(() => {
		if (!map || !google.maps.marker?.AdvancedMarkerElement) return;

		const marker = new google.maps.marker.AdvancedMarkerElement({
			map,
			position,
			content: createBrandPinElement(),
			title: "الموقع المحدد",
			gmpDraggable: false,
		});
		markerRef.current = marker;

		return () => {
			marker.map = null;
			markerRef.current = null;
		};
		// Recreate when map instance changes; position updates separately.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map]);

	useEffect(() => {
		if (markerRef.current) {
			markerRef.current.position = position;
		}
	}, [position]);

	return null;
}

type CheckState = "idle" | "checking" | "out-of-zone" | "confirmed";

const confirmButtonClass =
	"flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#30913F] to-[#267332] text-sm font-semibold text-white transition-all duration-200 hover:from-[#2a8036] hover:to-[#1f6628] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 dark:focus-visible:ring-offset-gray-900 sm:min-h-[56px]";

export function MapPickerClient({
	onConfirm,
	initialPosition,
}: MapPickerClientProps) {
	const router = useRouter();
	const startPos = initialPosition ?? DEFAULT_CENTER;

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
		libraries: GOOGLE_MAPS_LIBRARIES,
		language: GEOCODER_LANGUAGE,
		region: GEOCODER_REGION,
	});

	const [markerPos, setMarkerPos] =
		useState<google.maps.LatLngLiteral>(startPos);
	const [checkState, setCheckState] = useState<CheckState>("idle");
	const [formattedAddress, setFormattedAddress] = useState<string | null>(null);
	const [geocodedLocation, setGeocodedLocation] =
		useState<GeocodedLocation | null>(null);
	const [isResolvingAddress, setIsResolvingAddress] = useState(!!initialPosition);
	const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
	const geocodeRequestRef = useRef(0);
	const centerRef = useRef(startPos);

	const resolveAddressAt = useCallback(
		async (pos: google.maps.LatLngLiteral, requestId: number) => {
			try {
				const location = await reverseGeocode(pos.lat, pos.lng);
				if (requestId !== geocodeRequestRef.current) return;
				setGeocodedLocation(location);
				setFormattedAddress(location.formattedAddress);
			} catch {
				if (requestId !== geocodeRequestRef.current) return;
				setFormattedAddress(null);
				setGeocodedLocation(null);
			} finally {
				if (requestId === geocodeRequestRef.current) {
					setIsResolvingAddress(false);
				}
			}
		},
		[],
	);

	const onMapLoad = useCallback(
		(map: google.maps.Map) => {
			setMapInstance(map);

			if (initialPosition) {
				map.panTo(initialPosition);
				map.setZoom(15);
				const requestId = ++geocodeRequestRef.current;
				setIsResolvingAddress(true);
				void resolveAddressAt(initialPosition, requestId);
			}
		},
		[initialPosition, resolveAddressAt],
	);

	const handleMapClick = useCallback(
		async (e: google.maps.MapMouseEvent) => {
			if (!e.latLng) return;

			const nextPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
			const requestId = ++geocodeRequestRef.current;

			setMarkerPos(nextPos);
			setCheckState("idle");
			setFormattedAddress(null);
			setGeocodedLocation(null);
			setIsResolvingAddress(true);

			await resolveAddressAt(nextPos, requestId);
		},
		[resolveAddressAt],
	);

	const handleAutoRedirect = useCallback(async () => {
		const nextPos = DEFAULT_CENTER;
		const requestId = ++geocodeRequestRef.current;

		setCheckState("idle");
		setMarkerPos(nextPos);
		mapInstance?.panTo(nextPos);
		mapInstance?.setZoom(15);

		setFormattedAddress(null);
		setGeocodedLocation(null);
		setIsResolvingAddress(true);

		await resolveAddressAt(nextPos, requestId);
	}, [mapInstance, resolveAddressAt]);

	const handleGoHome = useCallback(() => {
		router.push("/home");
	}, [router]);

	const handleConfirm = useCallback(async () => {
		if (!geocodedLocation) return;

		setCheckState("checking");
		const result = await checkZone(markerPos.lat, markerPos.lng);

		if (!result.inZone) {
			setCheckState("out-of-zone");
			return;
		}

		setFormattedAddress(formatPickedAddress(geocodedLocation));
		setCheckState("confirmed");
		onConfirm({
			lat: geocodedLocation.lat,
			lng: geocodedLocation.lng,
			city: geocodedLocation.city,
			region: geocodedLocation.region,
			street_name: geocodedLocation.street_name,
		});
	}, [geocodedLocation, markerPos.lat, markerPos.lng, onConfirm]);

	if (loadError) {
		return (
			<div className="flex h-full min-h-[50dvh] flex-col items-center justify-center gap-3 bg-gray-50 p-4 text-center dark:bg-gray-900 sm:min-h-[55dvh] md:min-h-[60dvh] sm:p-6">
				<AlertCircle
					className="h-8 w-8 text-red-400 dark:text-red-500"
					aria-hidden
				/>
				<p className="text-sm font-medium text-gray-700 dark:text-gray-200">
					تعذّر تحميل الخريطة
				</p>
				<p className="text-xs text-gray-400 dark:text-gray-500">
					تحقق من مفتاح API أو اتصالك بالإنترنت
				</p>
			</div>
		);
	}

	if (!isLoaded) {
		return (
			<div className="flex h-full min-h-[50dvh] flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900 sm:min-h-[55dvh] md:min-h-[60dvh]">
				<Loader2
					className="h-7 w-7 animate-spin text-[#30913F] dark:text-[#3da84f]"
					aria-hidden
				/>
				<p className="text-xs font-medium text-gray-400 dark:text-gray-500">
					جاري تحميل الخريطة…
				</p>
			</div>
		);
	}

	const isChecking = checkState === "checking";
	const isOutOfZone = checkState === "out-of-zone";

	return (
		<div className="flex min-h-0 flex-1 flex-col" dir="rtl">
			<div className="relative min-h-[50dvh] flex-1 sm:min-h-[55dvh] md:min-h-[min(70dvh,720px)] lg:min-h-[min(75dvh,780px)]">
				<GoogleMap
					mapContainerClassName="absolute inset-0 h-full w-full"
					center={centerRef.current}
					zoom={15}
					onLoad={onMapLoad}
					onClick={handleMapClick}
					options={MAP_OPTIONS}
				>
					<AdvancedMapMarker map={mapInstance} position={markerPos} />
				</GoogleMap>

				{!isOutOfZone && (
					<div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-5">
						<div className="flex w-full max-w-md items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm dark:bg-gray-800/95 dark:shadow-black/20 sm:gap-2.5 sm:px-4 sm:py-2.5 md:max-w-lg">
							<MapPin
								className="h-4 w-4 shrink-0 text-[#30913F] dark:text-[#3da84f]"
								aria-hidden
							/>
							<span className="text-xs font-medium text-gray-700 dark:text-gray-200 sm:text-sm">
								{initialPosition
									? "يمكنك تعديل الموقع على الخريطة"
									: "اضغط على الخريطة لتحديد موقعك"}
							</span>
						</div>
					</div>
				)}

				{isOutOfZone && (
					<div className="absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-gray-900">
						<OutOfServiceArea
							onAutoRedirect={handleAutoRedirect}
							onGoHome={handleGoHome}
						/>
					</div>
				)}

				{!isOutOfZone && (
					<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
						<div className="pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-2xl bg-white/95 px-3.5 py-3.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:bg-gray-800/95 dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)] sm:gap-3 sm:px-4 sm:py-4 md:max-w-lg md:px-5 lg:max-w-xl">
							<div className="space-y-2 px-0.5">
								<p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
									الموقع المحدد
								</p>

								{isResolvingAddress ? (
									<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
										<Loader2
											className="h-4 w-4 shrink-0 animate-spin"
											aria-hidden
										/>
										<span>جاري تحديد العنوان…</span>
									</div>
								) : formattedAddress ? (
									<p className="break-words text-sm font-medium leading-relaxed text-gray-900 dark:text-gray-100">
										{formattedAddress}
									</p>
								) : (
									<p className="text-sm text-gray-400 dark:text-gray-500">
										اضغط على الخريطة لتحديد موقعك
									</p>
								)}

								<div className="flex items-center justify-between gap-2 pt-1">
									<span className="font-mono text-[11px] tabular-nums text-gray-400 dark:text-gray-500">
										{markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
									</span>
									{checkState === "idle" &&
										!isResolvingAddress &&
										formattedAddress && (
											<span className="text-[11px] text-gray-400 dark:text-gray-500">
												تحقق من دقة الموقع
											</span>
										)}
									{checkState === "confirmed" && (
										<span className="flex items-center gap-1 text-[11px] font-medium text-green-600 dark:text-green-400">
											<CheckCircle2 className="h-3 w-3" aria-hidden /> تم
											التأكيد
										</span>
									)}
								</div>
							</div>

							<button
								type="button"
								onClick={handleConfirm}
								disabled={
									isChecking ||
									checkState === "confirmed" ||
									isResolvingAddress ||
									!formattedAddress
								}
								className={confirmButtonClass}
							>
								{isChecking ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
										<span>جاري التحقق…</span>
									</>
								) : (
									"تأكيد الموقع"
								)}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
