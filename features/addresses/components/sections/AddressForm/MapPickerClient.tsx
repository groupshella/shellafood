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
	isArabic: boolean;
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

function reverseGeocode(
	lat: number,
	lng: number,
	language: "ar" | "en",
	errorMessage: string,
): Promise<GeocodedLocation> {
	const geocoder = new google.maps.Geocoder();

	return new Promise((resolve, reject) => {
		geocoder.geocode(
			{
				location: { lat, lng },
				language,
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

				reject(new Error(errorMessage));
			},
		);
	});
}

function formatPickedAddress(location: GeocodedLocation, isArabic: boolean): string {
	if (location.formattedAddress.trim()) return location.formattedAddress.trim();

	return [location.street_name, location.region, location.city]
		.filter(Boolean)
		.join(isArabic ? "، " : ", ");
}

function getBrandHex(): string {
	if (typeof window === "undefined") return "#30913F";
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue("--brand")
		.trim();
	return value || "#30913F";
}

function createBrandPinElement(): HTMLElement {
	const brand = getBrandHex();
	const PinElement = google.maps.marker?.PinElement;
	if (PinElement) {
		const pin = new PinElement({
			background: brand,
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
			<path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${brand}"/>
			<circle cx="18" cy="18" r="6" fill="#FFFFFF"/>
		</svg>
	`;
	return el;
}

/** AdvancedMarkerElement wrapper — replaces deprecated google.maps.Marker. */
function AdvancedMapMarker({
	map,
	position,
	title,
}: {
	map: google.maps.Map | null;
	position: google.maps.LatLngLiteral;
	title: string;
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
			title,
			gmpDraggable: false,
		});
		markerRef.current = marker;

		return () => {
			marker.map = null;
			markerRef.current = null;
		};
		// Recreate when map instance changes; position updates separately.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [map, title]);

	useEffect(() => {
		if (markerRef.current) {
			markerRef.current.position = position;
		}
	}, [position]);

	return null;
}

type CheckState = "idle" | "checking" | "out-of-zone" | "confirmed";

const confirmButtonClass =
	"flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-brand text-sm font-semibold text-brand-foreground transition-all duration-200 hover:brightness-95 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 sm:min-h-[56px]";

export function MapPickerClient({
	onConfirm,
	initialPosition,
	isArabic,
}: MapPickerClientProps) {
	const router = useRouter();
	const startPos = initialPosition ?? DEFAULT_CENTER;
	const geocoderLanguage = isArabic ? "ar" : "en";

	const { isLoaded, loadError } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
		libraries: GOOGLE_MAPS_LIBRARIES,
		language: geocoderLanguage,
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
				const location = await reverseGeocode(
					pos.lat,
					pos.lng,
					geocoderLanguage,
					isArabic ? "تعذّر تحديد العنوان" : "Could not resolve address",
				);
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
		[geocoderLanguage, isArabic],
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

		setFormattedAddress(formatPickedAddress(geocodedLocation, isArabic));
		setCheckState("confirmed");
		onConfirm({
			lat: geocodedLocation.lat,
			lng: geocodedLocation.lng,
			city: geocodedLocation.city,
			region: geocodedLocation.region,
			street_name: geocodedLocation.street_name,
		});
	}, [geocodedLocation, isArabic, markerPos.lat, markerPos.lng, onConfirm]);

	if (loadError) {
		return (
			<div
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				className="flex h-full min-h-[50dvh] flex-col items-center justify-center gap-3 bg-card p-4 text-center sm:min-h-[55dvh] sm:p-6 md:min-h-[60dvh]"
			>
				<AlertCircle
					className="h-8 w-8 text-red-400 dark:text-red-500"
					aria-hidden
				/>
				<p className="text-sm font-medium text-foreground">
					{isArabic ? "تعذّر تحميل الخريطة" : "Could not load the map"}
				</p>
				<p className="text-xs text-muted">
					{isArabic
						? "تحقق من مفتاح API أو اتصالك بالإنترنت"
						: "Check your API key or internet connection"}
				</p>
			</div>
		);
	}

	if (!isLoaded) {
		return (
			<div
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				className="flex h-full min-h-[50dvh] flex-col items-center justify-center gap-3 bg-card sm:min-h-[55dvh] md:min-h-[60dvh]"
			>
				<Loader2
					className="h-7 w-7 animate-spin text-brand"
					aria-hidden
				/>
				<p className="text-xs font-medium text-muted">
					{isArabic ? "جاري تحميل الخريطة…" : "Loading map…"}
				</p>
			</div>
		);
	}

	const isChecking = checkState === "checking";
	const isOutOfZone = checkState === "out-of-zone";
	const markerTitle = isArabic ? "الموقع المحدد" : "Selected location";

	return (
		<div
			className="flex min-h-0 flex-1 flex-col"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<div className="relative min-h-[50dvh] flex-1 sm:min-h-[55dvh] md:min-h-[min(70dvh,720px)] lg:min-h-[min(75dvh,780px)]">
				<GoogleMap
					mapContainerClassName="absolute inset-0 h-full w-full"
					center={centerRef.current}
					zoom={15}
					onLoad={onMapLoad}
					onClick={handleMapClick}
					options={MAP_OPTIONS}
				>
					<AdvancedMapMarker
						map={mapInstance}
						position={markerPos}
						title={markerTitle}
					/>
				</GoogleMap>

				{!isOutOfZone && (
					<div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-5">
						<div className="flex w-full max-w-md items-center gap-2 rounded-2xl bg-background/95 px-3 py-2 shadow-md backdrop-blur-sm sm:gap-2.5 sm:px-4 sm:py-2.5 md:max-w-lg lg:max-w-xl">
							<MapPin
								className="h-4 w-4 shrink-0 text-brand"
								aria-hidden
							/>
							<span className="text-xs font-medium text-foreground sm:text-sm">
								{initialPosition
									? isArabic
										? "يمكنك تعديل الموقع على الخريطة"
										: "You can adjust the location on the map"
									: isArabic
										? "اضغط على الخريطة لتحديد موقعك"
										: "Tap the map to set your location"}
							</span>
						</div>
					</div>
				)}

				{isOutOfZone && (
					<div className="absolute inset-0 z-20 flex items-center justify-center bg-background">
						<OutOfServiceArea
							onAutoRedirect={handleAutoRedirect}
							onGoHome={handleGoHome}
							isArabic={isArabic}
						/>
					</div>
				)}

				{!isOutOfZone && (
					<div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
						<div className="pointer-events-auto flex w-full max-w-md flex-col gap-3 rounded-2xl bg-background/95 px-3.5 py-3.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm sm:gap-3 sm:px-4 sm:py-4 md:max-w-lg md:px-5 lg:max-w-xl">
							<div className="space-y-2 px-0.5">
								<p className="text-xs font-semibold text-muted">
									{isArabic ? "الموقع المحدد" : "Selected location"}
								</p>

								{isResolvingAddress ? (
									<div className="flex items-center gap-2 text-sm text-muted">
										<Loader2
											className="h-4 w-4 shrink-0 animate-spin"
											aria-hidden
										/>
										<span>
											{isArabic
												? "جاري تحديد العنوان…"
												: "Resolving address…"}
										</span>
									</div>
								) : formattedAddress ? (
									<p className="break-words text-sm font-medium leading-relaxed text-foreground">
										{formattedAddress}
									</p>
								) : (
									<p className="text-sm text-muted">
										{isArabic
											? "اضغط على الخريطة لتحديد موقعك"
											: "Tap the map to set your location"}
									</p>
								)}

								<div className="flex items-center justify-between gap-2 pt-1">
									<span className="font-mono text-[11px] tabular-nums text-muted">
										{markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
									</span>
									{checkState === "idle" &&
										!isResolvingAddress &&
										formattedAddress && (
											<span className="text-[11px] text-muted">
												{isArabic
													? "تحقق من دقة الموقع"
													: "Check location accuracy"}
											</span>
										)}
									{checkState === "confirmed" && (
										<span className="flex items-center gap-1 text-[11px] font-medium text-brand">
											<CheckCircle2 className="h-3 w-3" aria-hidden />{" "}
											{isArabic ? "تم التأكيد" : "Confirmed"}
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
										<span>
											{isArabic ? "جاري التحقق…" : "Checking…"}
										</span>
									</>
								) : isArabic ? (
									"تأكيد الموقع"
								) : (
									"Confirm location"
								)}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
