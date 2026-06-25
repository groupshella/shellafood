"use client";

import { useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { MapPin, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { checkZone } from "@/features/addresses/actions/check-zone";
import { PickedLocation } from "@/features/addresses/types/address.types";

interface MapPickerClientProps {
  onConfirm: (location: PickedLocation) => void;
}

const DEFAULT_CENTER: google.maps.LatLngLiteral = {
  lat: Number(process.env.NEXT_PUBLIC_LATITUDE) || 24.7136,
  lng: Number(process.env.NEXT_PUBLIC_LONGITUDE) || 46.6753,
};

// Plain object — do not type as google.maps.MapOptions at module scope.
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

// Stable reference — inline arrays cause LoadScript reload warnings.
const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];

type CheckState = "idle" | "checking" | "out-of-zone" | "confirmed";

export function MapPickerClient({ onConfirm }: MapPickerClientProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [markerPos, setMarkerPos] =
    useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [checkState, setCheckState] = useState<CheckState>("idle");
  const mapRef = useRef<google.maps.Map | null>(null);

  // Stable initial center — changing this prop re-centers the map, so we
  // hold it in a ref and never update it.
  const centerRef = useRef(DEFAULT_CENTER);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    setMarkerPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setCheckState("idle");
  }, []);

  const handleConfirm = useCallback(async () => {
    setCheckState("checking");
    const result = await checkZone(markerPos.lat, markerPos.lng);

    if (!result.inZone) {
      setCheckState("out-of-zone");
      return;
    }

    setCheckState("confirmed");
    onConfirm({
      lat: markerPos.lat,
      lng: markerPos.lng,
      city: result.city ?? "",
      region: result.region ?? "",
      street_name: result.street_name ?? "",
    });
  }, [markerPos, onConfirm]);

  // ── Error ──────────────────────────────────────────────────────────────────
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

  // ── Loading ────────────────────────────────────────────────────────────────
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

      {/* Map area must have a definite height — percentage height alone collapses in flex layouts */}
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

        {/* Hint banner */}
        {!isOutOfZone && (
          <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-md">
              <MapPin className="w-4 h-4 text-[#30913F] shrink-0" />
              <span className="text-xs text-gray-700 font-medium">
                اضغط على الخريطة لتحديد موقعك
              </span>
            </div>
          </div>
        )}

        {/* Out-of-zone banner */}
        {isOutOfZone && (
          <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none">
            <div className="bg-red-500 rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-md">
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
              <span className="text-xs text-white font-semibold">
                المنطقة خارج نطاق التوصيل — اختر موقعاً آخر
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom sheet ──────────────────────────────────────────────────── */}
      <div className="bg-white px-4 pt-4 pb-6 flex flex-col gap-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">

        {/* Coordinates + status row */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] text-gray-400 font-mono tabular-nums">
            {markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
          </span>
          {checkState === "idle" && (
            <span className="text-[11px] text-gray-400">حدد الموقع بدقة</span>
          )}
          {isOutOfZone && (
            <span className="text-[11px] text-red-500 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> خارج النطاق
            </span>
          )}
          {checkState === "confirmed" && (
            <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> تم التأكيد
            </span>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={isChecking || checkState === "confirmed"}
          className="
            w-full text-white text-sm font-semibold
            rounded-2xl py-4 flex items-center justify-center gap-2
            transition-all duration-200 active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#30913F] focus-visible:ring-offset-2
          "
          style={{
            background: isOutOfZone
              ? "#ef4444"
              : "linear-gradient(135deg, #30913F 0%, #267332 100%)",
          }}
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري التحقق…</span>
            </>
          ) : isOutOfZone ? (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>اختر موقعاً داخل نطاق الخدمة</span>
            </>
          ) : (
            "تأكيد الموقع"
          )}
        </button>
      </div>
    </div>
  );
}