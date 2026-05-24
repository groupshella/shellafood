// src/features/profile/hooks/UseTransportOrder.ts
"use client";

import { useState, useCallback } from "react";
import type {
  OrderFormData,
  LocationPoint,
} from "@/features/pick-and-order/types/Order.types";

// ─── API response shape ───────────────────────────────────────────────────────

export interface TransportOrderApiResponse {
  succeeded: boolean;
  message: string;
  data?: {
    id: number;
    orderNumber: string;
    transportType: string;
    orderType: string;
    status: string;
    shipmentCategory: string;
    numberOfPieces: number;
    shipmentValue?: number;
    description: string;
    weightKg?: number;
    dimensionsCm?: string;
    specialInstructions?: string;
    isFragile: boolean;
    isExpress: boolean;
    requiresRefrigeration: boolean;
    loadingEquipmentNeeded: boolean;
    isDocuments: boolean;
    truckType?: string;
    createdAt: string;
    stops: {
      id: number; type: string; stopOrder: number;
      lat?: number; lng?: number; streetName: string;
      building?: string; additionalDetails?: string; landmark?: string;
      buildingPhotoUrl?: string; scheduledAt?: string;
      contactPhone?: string; recipientName?: string; recipientPhone?: string;
    }[];
    images: { url: string }[];
  };
  errors?: string[];
}

export interface UseTransportOrderReturn {
  submitting: boolean;
  error: string | null;
  submitOrder: (
    form: OrderFormData,
    orderType: string,
    stopPhotoFiles: Map<number, File>,
    packageImageFiles: File[]
  ) => Promise<TransportOrderApiResponse | null>;
  reset: () => void;
}

// ─── FormData builder ─────────────────────────────────────────────────────────

function buildFormData(
  form: OrderFormData,
  orderType: string,
  stopPhotoFiles: Map<number, File>,
  packageImageFiles: File[]
): FormData {
  const fd = new FormData();

  fd.append("TransportType", form.transportType);
  fd.append("OrderType", orderType);          // ✅ fixed: no longer hardcoded
  fd.append("ShipmentCategory", form.shipmentCategory);
  fd.append("NumberOfPieces", String(form.numberOfPieces || 1));
  fd.append("Description", form.packageDescription);
  fd.append("IsFragile", String(form.isFragile ?? false));
  fd.append("IsExpress", String(form.isExpress ?? false));
  fd.append("RequiresRefrigeration", String(form.requiresRefrigeration ?? false));
  fd.append("LoadingEquipmentNeeded", String(form.loadingEquipmentNeeded ?? false));
  fd.append("IsDocuments", String(form.isDocuments ?? false));

  if (form.shipmentValue) fd.append("ShipmentValue", String(form.shipmentValue));
  if (form.packageWeight) fd.append("WeightKg", String(form.packageWeight));
  if (form.packageDimensions) fd.append("DimensionsCm", form.packageDimensions);
  if (form.specialInstructions) fd.append("SpecialInstructions", form.specialInstructions);
  if (form.truckType) fd.append("TruckType", form.truckType);

  // ── Stops ──
  form.locationPoints.forEach((pt: LocationPoint, i: number) => {
    const stopOrder = i + 1;
    const prefix = `Stops[${i}]`;

    fd.append(`${prefix}.Type`, pt.type === "pickup" ? "pickup" : "dropoff");
    fd.append(`${prefix}.StopOrder`, String(stopOrder));
    fd.append(`${prefix}.StreetName`, pt.streetName ?? "");

    if (pt.location?.lat != null) fd.append(`${prefix}.Lat`, String(pt.location.lat));
    if (pt.location?.lng != null) fd.append(`${prefix}.Lng`, String(pt.location.lng));
    if (pt.building) fd.append(`${prefix}.Building`, pt.building);
    if (pt.additionalDetails) fd.append(`${prefix}.AdditionalDetails`, pt.additionalDetails);
    if (pt.landmark) fd.append(`${prefix}.Landmark`, pt.landmark);
    if (pt.contactPhone) fd.append(`${prefix}.ContactPhone`, pt.contactPhone);
    if (pt.recipientName) fd.append(`${prefix}.RecipientName`, pt.recipientName);
    if (pt.recipientPhone) fd.append(`${prefix}.RecipientPhone`, pt.recipientPhone);
    if (pt.scheduledDateTime)
      fd.append(`${prefix}.ScheduledAt`, new Date(pt.scheduledDateTime).toISOString());
  });

  // ── Stop photos — parallel arrays ──
  form.locationPoints.forEach((_pt: LocationPoint, i: number) => {
    const stopOrder = i + 1;
    const photo = stopPhotoFiles.get(stopOrder);
    if (photo) {
      fd.append(`StopPhotos[${stopOrder}]`, photo, photo.name);
    }
  });

  // ── Package images ──
  packageImageFiles.forEach((file, i) => {
    fd.append(`Images`, file, file.name);
  });

  return fd;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTransportOrder(): UseTransportOrderReturn {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitOrder = useCallback(async (
    form: OrderFormData,
    orderType: string,
    stopPhotoFiles: Map<number, File>,
    packageImageFiles: File[]
  ): Promise<TransportOrderApiResponse | null> => {
    setSubmitting(true);
    setError(null);

    try {
      const formData = buildFormData(form, orderType, stopPhotoFiles, packageImageFiles);

      const response = await fetch("/api/transportServiceOrder/create", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data: TransportOrderApiResponse = await response.json();

      if (!response.ok || !data.succeeded) {
        setError(data.message ?? data.errors?.join(", ") ?? "حدث خطأ أثناء إرسال الطلب");
        return data;
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر الاتصال بالخادم");
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => setError(null), []);

  return { submitting, error, submitOrder, reset };
}