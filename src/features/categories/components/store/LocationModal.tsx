"use client";

import { memo, useMemo } from "react";
import { MapModal } from "@/features/profile";
import type { Address } from "@/shared/hooks";

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
      id: 0,
      address_type: "store",
      contact_person_number: "",
      address: address || `${latitude}, ${longitude}`,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      user_id: 0,
      contact_person_name: storeName,
      created_at: "",
      updated_at: "",
      zone_id: 0,
      zone_ids: [],
      floor: null,
      road: null,
      house: null,
    };
  }, [isOpen, storeName, latitude, longitude, address]);

  if (!storeAddress) return null;

  return (
    <MapModal
      isOpen={isOpen}
      onClose={onClose}
      address={storeAddress}
    />
  );
} 

export default memo(LocationModal);

