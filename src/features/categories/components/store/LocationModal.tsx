"use client";

import { memo, useMemo } from "react";
import { MapModal } from "@/features/profile";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeName: string;
  latitude: number;
  longitude: number;
  address?: string;
}

function LocationModal({ isOpen, onClose, storeName, latitude, longitude, address }: LocationModalProps) {
  // Convert store location to Address format for MapModal
  const storeAddress = useMemo(() => {
    if (!isOpen) return null;
    
    return {
      id: "store-location",
      type: "store",
      title: storeName,
      address: address || `${latitude}, ${longitude}`,
      details: "",
      phone: "",
      isDefault: false,
      coordinates: {
        lat: latitude,
        lng: longitude,
      },
    };
  }, [isOpen, storeName, latitude, longitude, address]);

  return (
    <MapModal
      isOpen={isOpen}
      onClose={onClose}
      address={storeAddress}
    />
  );
}

export default memo(LocationModal);

