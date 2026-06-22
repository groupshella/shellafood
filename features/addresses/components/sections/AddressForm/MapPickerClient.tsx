"use client";

import { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";
import { checkZone } from "@/features/addresses/actions/check-zone";
import { PickedLocation } from "@/features/addresses/types/address.types";

interface MapPickerClientProps {
  onConfirm: (location: PickedLocation) => void;
}

const DEFAULT_CENTER = {
  lat: Number(process.env.NEXT_PUBLIC_LATITUDE) || 24.7136,
  lng: Number(process.env.NEXT_PUBLIC_LONGITUDE) || 46.6753,
};

const MAP_STYLES = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
];

// Define icon outside render to avoid recreating on every render
// Only call this after the Maps SDK is loaded
function buildMarkerIcon() {
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="#30913F"/>
          <circle cx="18" cy="18" r="7" fill="white"/>
        </svg>
      `),
    scaledSize: new window.google.maps.Size(36, 44),
    anchor: new window.google.maps.Point(18, 44),
  };
}

export function MapPickerClient({ onConfirm }: MapPickerClientProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  const [markerPos, setMarkerPos] = useState<google.maps.LatLngLiteral>(DEFAULT_CENTER);
  const [isChecking, setIsChecking] = useState(false);
  const [outOfZone, setOutOfZone] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Stable center — don't re-center on every marker move
  const centerRef = useRef(DEFAULT_CENTER);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  function handleMapClick(e: google.maps.MapMouseEvent) {
    if (!e.latLng) return;
    setMarkerPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    setOutOfZone(false);
  }

  async function handleConfirm() {
    setIsChecking(true);
    setOutOfZone(false);

    const result = await checkZone(markerPos.lat, markerPos.lng);

    setIsChecking(false);

    if (!result.inZone) {
      setOutOfZone(true);
      return;
    }

    onConfirm({
      lat: markerPos.lat,
      lng: markerPos.lng,
      city: result.city ?? "",
      region: result.region ?? "",
      street_name: result.street_name ?? "",
    });
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100">
        <Loader2 className="w-6 h-6 text-[#30913F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Map area — explicit height so it never collapses */}
      <div className="relative" style={{ flex: "1 1 0", minHeight: 0 }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={centerRef.current}
          zoom={15}
          onLoad={onMapLoad}
          onClick={handleMapClick}
          options={{
            styles: MAP_STYLES,
            disableDefaultUI: true,
            zoomControl: true,
            clickableIcons: false,
          }}
        >
          <Marker
            position={markerPos}
            icon={buildMarkerIcon()} // safe — only called when isLoaded is true
          />
        </GoogleMap>

        <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 flex items-center gap-2 shadow-sm">
            <MapPin className="w-4 h-4 text-[#30913F]" />
            <span className="text-xs text-gray-700 font-medium">
              اضغط على الخريطة لتحديد موقعك
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 pt-4 pb-6 flex flex-col gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {outOfZone && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-center">
            <p className="text-sm text-red-600 font-medium">
              هذه المنطقة خارج نطاق خدمتنا
            </p>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={isChecking}
          className="
            w-full bg-[#30913F] text-white text-sm font-semibold
            rounded-2xl py-4 flex items-center justify-center gap-2
            active:bg-[#267332] transition-colors
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري التحقق...</span>
            </>
          ) : (
            "تأكيد الموقع"
          )}
        </button>
      </div>
    </div>
  );
}