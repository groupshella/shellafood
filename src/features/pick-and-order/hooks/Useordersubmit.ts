"use client";

import { useState, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LocationPoint {
  id: string;
  type: "pickup" | "dropoff";
  label: string;
  streetName: string;
  areaName: string;
  city: string;
  building: string;
  additionalDetails: string;
  recipientName: string;
  recipientPhone: string;
  buildingPhoto: string | null;
  location: { lat: number; lng: number } | null;
}

export interface OrderFormData {
  transportType: string;
  orderType: "one-way" | "multi-direction";
  locationPoints: LocationPoint[];
  packageDescription: string;
  packageWeight: string;
  packageDimensions: string;
  specialInstructions: string;
  packageImages: string[];
  packageVideo: string | null;
  isFragile: boolean;
  requiresRefrigeration: boolean;
  loadingEquipmentNeeded: boolean;
  isExpress: boolean;
  isDocuments: boolean;
  truckType: string;
  cargoType: string;
  packageType: string;
}

export type OrderStep = "details" | "summary" | "confirmation";

export interface SubmitState {
  isLoading: boolean;
  error: string | null;
  orderId: string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

// ─── Default blank point factory ─────────────────────────────────────────────

export function createBlankPoint(type: "pickup" | "dropoff", index: number): LocationPoint {
  return {
    id: `${type}-${Date.now()}-${index}`,
    type,
    label: type === "pickup" ? `نقطة الالتقاط ${index + 1}` : `نقطة التوصيل ${index + 1}`,
    streetName: "",
    areaName: "",
    city: "",
    building: "",
    additionalDetails: "",
    recipientName: "",
    recipientPhone: "",
    buildingPhoto: null,
    location: null,
  };
}

// ─── Default form state ───────────────────────────────────────────────────────

export function createDefaultFormData(transportType = "motorbike"): OrderFormData {
  return {
    transportType,
    orderType: "one-way",
    locationPoints: [createBlankPoint("pickup", 0), createBlankPoint("dropoff", 0)],
    packageDescription: "",
    packageWeight: "",
    packageDimensions: "",
    specialInstructions: "",
    packageImages: [],
    packageVideo: null,
    isFragile: false,
    requiresRefrigeration: false,
    loadingEquipmentNeeded: false,
    isExpress: false,
    isDocuments: false,
    truckType: "",
    cargoType: "",
    packageType: "",
  };
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateOrderForm(data: OrderFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const pickups = data.locationPoints.filter((p) => p.type === "pickup");
  const dropoffs = data.locationPoints.filter((p) => p.type === "dropoff");

  if (pickups.length === 0) errors.pickup = "يجب إضافة نقطة التقاط واحدة على الأقل";
  if (dropoffs.length === 0) errors.dropoff = "يجب إضافة نقطة توصيل واحدة على الأقل";

  pickups.forEach((p, i) => {
    if (!p.city.trim()) errors[`pickup_${i}_city`] = "المدينة مطلوبة";
    if (!p.streetName.trim()) errors[`pickup_${i}_street`] = "الشارع مطلوب";
  });

  dropoffs.forEach((p, i) => {
    if (!p.city.trim()) errors[`dropoff_${i}_city`] = "المدينة مطلوبة";
    if (!p.streetName.trim()) errors[`dropoff_${i}_street`] = "الشارع مطلوب";
    if (!p.recipientName.trim()) errors[`dropoff_${i}_name`] = "اسم المستلم مطلوب";
    if (!p.recipientPhone.trim()) errors[`dropoff_${i}_phone`] = "رقم المستلم مطلوب";
  });

  if (!data.packageDescription.trim()) errors.packageDescription = "وصف الشحنة مطلوب";
  if (!data.packageWeight.trim()) errors.packageWeight = "وزن الشحنة مطلوب";

  return errors;
}

// ─── Completion score ─────────────────────────────────────────────────────────

export function calcCompletion(data: OrderFormData): number {
  const errors = validateOrderForm(data);
  const totalChecks = 6 + data.locationPoints.filter((p) => p.type === "dropoff").length * 2;
  const errorCount = Object.keys(errors).length;
  return Math.max(0, Math.round(((totalChecks - errorCount) / totalChecks) * 100));
}

// ─── Mock pricing ─────────────────────────────────────────────────────────────

export interface PricingBreakdown {
  basePrice: number;
  platformFee: number;
  subtotal: number;
  vat: number;
  total: number;
  distance: number;
}

export function calcPricing(data: OrderFormData): PricingBreakdown {
  const isMotorbike = data.transportType === "motorbike";
  const distanceKm = 8.5; // mock — replace with real geo calculation
  const baseRate = isMotorbike ? 2.5 : 5.0;
  const basePrice = Math.max(15, distanceKm * baseRate);
  const extras =
    (data.isExpress ? 20 : 0) +
    (data.requiresRefrigeration ? 15 : 0) +
    (data.loadingEquipmentNeeded ? 25 : 0);
  const platformFee = Math.round(basePrice * 0.1 * 100) / 100;
  const subtotal = Math.round((basePrice + extras + platformFee) * 100) / 100;
  const vat = Math.round(subtotal * 0.15 * 100) / 100;
  const total = Math.round((subtotal + vat) * 100) / 100;
  return { basePrice: Math.round(basePrice * 100) / 100, platformFee, subtotal, vat, total, distance: distanceKm };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOrderSubmit(initialTransportType = "motorbike") {
  const [step, setStep] = useState<OrderStep>("details");
  const [formData, setFormData] = useState<OrderFormData>(() => createDefaultFormData(initialTransportType));
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [submitState, setSubmitState] = useState<SubmitState>({
    isLoading: false,
    error: null,
    orderId: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  // ── Field updater ──────────────────────────────────────────────────────────
  const updateField = useCallback(<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setTouchedFields((prev) => new Set(prev).add(key as string));
  }, []);

  // ── Location point updater ─────────────────────────────────────────────────
  const updateLocationPoint = useCallback(
    (id: string, patch: Partial<LocationPoint>) => {
      setFormData((prev) => ({
        ...prev,
        locationPoints: prev.locationPoints.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
    },
    []
  );

  const addLocationPoint = useCallback((type: "pickup" | "dropoff") => {
    setFormData((prev) => {
      const sameType = prev.locationPoints.filter((p) => p.type === type);
      return {
        ...prev,
        locationPoints: [...prev.locationPoints, createBlankPoint(type, sameType.length)],
      };
    });
  }, []);

  const removeLocationPoint = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      locationPoints: prev.locationPoints.filter((p) => p.id !== id),
    }));
  }, []);

  // ── Step navigation ────────────────────────────────────────────────────────
  const goToSummary = useCallback(() => {
    const errors = validateOrderForm(formData);
    setValidationErrors(errors);
    // Mark all fields touched
    setTouchedFields(new Set(Object.keys(errors)));
    if (Object.keys(errors).length === 0) {
      setStep("summary");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [formData]);

  const goToDetails = useCallback(() => {
    setStep("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const submitOrder = useCallback(async () => {
    setSubmitState({ isLoading: true, error: null, orderId: null });

    // Cancel previous request if any
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      // Simulate API call — replace with real fetch
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, 1500);
        abortRef.current!.signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });

      const generatedId = `ORD-${Date.now().toString().slice(-8)}`;

      // Persist to sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lastOrderId", generatedId);
        sessionStorage.setItem("lastOrderData", JSON.stringify(formData));
        sessionStorage.setItem("lastOrderPricing", JSON.stringify(calcPricing(formData)));
      }

      setSubmitState({ isLoading: false, error: null, orderId: generatedId });
      setStep("confirmation");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setSubmitState({
          isLoading: false,
          error: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مجدداً.",
          orderId: null,
        });
      }
    }
  }, [formData]);

  const pricing = calcPricing(formData);
  const completion = calcCompletion(formData);

  return {
    step,
    formData,
    validationErrors,
    touchedFields,
    submitState,
    pricing,
    completion,
    updateField,
    updateLocationPoint,
    addLocationPoint,
    removeLocationPoint,
    goToSummary,
    goToDetails,
    submitOrder,
    setStep,
  };
}