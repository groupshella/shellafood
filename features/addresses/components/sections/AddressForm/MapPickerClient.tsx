"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
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

const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  gestureHandling: "greedy",
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  ],
};

const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];

const GEOCODER_LANGUAGE = "ar";
const GEOCODER_REGION = "SA";

function extractAddressParts(components: google.maps.GeocoderAddressComponent[]) {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name ?? "";

  return {
    city: get("locality") || get("administrative_area_level_1"),
    region: get("sublocality") || get("administrative_area_level_2") || get("neighborhood"),
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
      { location: { lat, lng }, language: GEOCODER_LANGUAGE, region: GEOCODER_REGION },
      (results, status) => {
        if (status === "OK" && results?.[0]?.formatted_address) {
          const { formatted_address, address_components } = results[0];
          const { city, region, street_name } = extractAddressParts(address_components);

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

  return [location.street_name, location.region, location.city].filter(Boolean).join("، ");
}

type CheckState = "idle" | "checking" | "out-of-zone" | "confirmed";

export function MapPickerClient({ onConfirm, initialPosition }: MapPickerClientProps) {
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
  const [geocodedLocation, setGeocodedLocation] = useState<GeocodedLocation | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(!!initialPosition);
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocodeRequestRef = useRef(0);
  const centerRef = useRef(startPos);

  const resolveAddressAt = useCallback(async (
    pos: google.maps.LatLngLiteral,
    requestId: number,
  ) => {
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
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    if (initialPosition) {
      map.panTo(initialPosition);
      map.setZoom(15);
      const requestId = ++geocodeRequestRef.current;
      setIsResolvingAddress(true);
      void resolveAddressAt(initialPosition, requestId);
    }
  }, [initialPosition, resolveAddressAt]);

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const nextPos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    const requestId = ++geocodeRequestRef.current;

    setMarkerPos(nextPos);
    setCheckState("idle");
    setFormattedAddress(null);
    setGeocodedLocation(null);
    setIsResolvingAddress(true);

    await resolveAddressAt(nextPos, requestId);
  }, [resolveAddressAt]);

  const handleAutoRedirect = useCallback(async () => {
    const nextPos = DEFAULT_CENTER;
    const requestId = ++geocodeRequestRef.current;

    setCheckState("idle");
    setMarkerPos(nextPos);
    mapRef.current?.panTo(nextPos);
    mapRef.current?.setZoom(15);

    setFormattedAddress(null);
    setGeocodedLocation(null);
    setIsResolvingAddress(true);

    await resolveAddressAt(nextPos, requestId);
  }, [resolveAddressAt]);

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
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-gray-50 p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm font-medium text-gray-700">تعذّر تحميل الخريطة</p>
        <p className="text-xs text-gray-400">
          تحقق من مفتاح API أو اتصالك بالإنترنت
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-gray-50">
        <Loader2 className="w-7 h-7 text-[#30913F] animate-spin" />
        <p className="text-xs text-gray-400 font-medium">جاري تحميل الخريطة…</p>
      </div>
    );
  }

  const isChecking = checkState === "checking";
  const isOutOfZone = checkState === "out-of-zone";

  return (
    <div className="flex min-h-0 flex-1 flex-col" dir="rtl">
      <div className="relative min-h-[50dvh] flex-1">
        <GoogleMap
          mapContainerClassName="absolute inset-0"
          center={centerRef.current}
          zoom={15}
          onLoad={onMapLoad}
          onClick={handleMapClick}
          options={MAP_OPTIONS}
        >
          <Marker
            position={markerPos}
            icon={{
              path: "M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0zM18 24a6 6 0 1 1 0-12 6 6 0 0 1 0 12z",
              fillColor: "#30913F",
              fillOpacity: 1,
              strokeWeight: 0,
              scale: 1.1,
              anchor: new google.maps.Point(18, 44),
            }}
          />
        </GoogleMap>

        {!isOutOfZone && (
          <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-md">
              <MapPin className="w-4 h-4 text-[#30913F] shrink-0" />
              <span className="text-xs text-gray-700 font-medium">
                {initialPosition
                  ? "يمكنك تعديل الموقع على الخريطة"
                  : "اضغط على الخريطة لتحديد موقعك"}
              </span>
            </div>
          </div>
        )}

        {isOutOfZone && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white">
            <OutOfServiceArea
              onAutoRedirect={handleAutoRedirect}
              onGoHome={handleGoHome}
            />
          </div>
        )}

        {!isOutOfZone && (
          <div className="absolute bottom-18 inset-x-4 z-10 flex flex-col gap-3 pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-3 rounded-2xl bg-white/95 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
              <div className="space-y-2 px-1">
                <p className="text-xs font-semibold text-gray-500">الموقع المحدد</p>

                {isResolvingAddress ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span>جاري تحديد العنوان…</span>
                  </div>
                ) : formattedAddress ? (
                  <p className="text-sm font-medium leading-relaxed text-gray-900">
                    {formattedAddress}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">اضغط على الخريطة لتحديد موقعك</p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-gray-400 font-mono tabular-nums">
                    {markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
                  </span>
                  {checkState === "idle" && !isResolvingAddress && formattedAddress && (
                    <span className="text-[11px] text-gray-400">تحقق من دقة الموقع</span>
                  )}
                  {checkState === "confirmed" && (
                    <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> تم التأكيد
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={isChecking || checkState === "confirmed" || isResolvingAddress || !formattedAddress}
                className="w-full rounded-2xl bg-gradient-to-br from-[#30913F] to-[#267332] py-4 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 flex items-center justify-center gap-2"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
