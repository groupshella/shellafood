// ─── Shared types for the Pick & Order flow ──────────────────────────────────

export interface LatLng {
    lat: number;
    lng: number;
  }
  
  export interface LocationPoint {
    id: string;
    type: "pickup" | "dropoff";
    label: string;
    location: LatLng | null;
    streetName: string;
    areaName: string;
    city: string;
    building: string;
    additionalDetails: string;
    buildingPhoto: string | null;
    recipientName: string;
    recipientPhone: string;
    scheduledDateTime: string;
    contactPhone: string;
    landmark: string;
  }
  
  export interface OrderFormData {
    transportType: string;
    locationPoints: LocationPoint[];
    packageDescription: string;
    packageWeight: string;
    packageDimensions: string;
    specialInstructions: string;
    packageImages: string[];
    isFragile: boolean;
    requiresRefrigeration: boolean;
    loadingEquipmentNeeded: boolean;
    isExpress: boolean;
    isDocuments: boolean;
    truckType: string;
    shipmentCategory: string;
    numberOfPieces: string;
    shipmentValue: string;
  }
  
  export interface PricingBreakdown {
    base: number;
    platformFee: number;
    extras: number;
    subtotal: number;
    vat: number;
    total: number;
    distanceKm: number;
  }
  
  export interface ConfirmationData {
    orderId: string;
    form: OrderFormData;
    pricing: PricingBreakdown;
  }
  
  export type OrderStep = "details" | "summary" | "confirmation";
  export type ValidationErrors = Record<string, string>;
  export type TransportType = "motorbike" | "truck";
  
  // ─── Constants ────────────────────────────────────────────────────────────────
  
  export const SHIPMENT_LABELS: Record<string, string> = {
    furniture:    "أثاث",
    electronics:  "إلكترونيات",
    food:         "مواد غذائية",
    construction: "مواد بناء",
    documents:    "مستندات",
    clothing:     "ملابس",
    other:        "أخرى",
  };
  
  export const TRUCK_TYPE_LABELS: Record<string, string> = {
    small:       "شاحنة صغيرة (حتى 1.5 طن)",
    medium:      "شاحنة متوسطة (1.5 - 3 طن)",
    large:       "شاحنة كبيرة (3 - 7 طن)",
    flatbed:     "شاحنة مسطحة",
    refrigerated:"شاحنة مبردة",
    container:   "شاحنة حاوية",
    crane:       "شاحنة رافعة",
  };
  
  // ─── Factories ────────────────────────────────────────────────────────────────
  
  let _idCounter = 0;
  export const uid = () => `pt-${++_idCounter}-${Date.now()}`;
  
  export function makePoint(type: "pickup" | "dropoff", index = 0): LocationPoint {
    return {
      id: uid(),
      type,
      label: type === "pickup" ? `نقطة الالتقاط ${index + 1}` : `نقطة التوصيل ${index + 1}`,
      location: null,
      streetName: "",
      areaName: "",
      city: "",
      building: "",
      additionalDetails: "",
      buildingPhoto: null,
      recipientName: "",
      recipientPhone: "",
      scheduledDateTime: "",
      contactPhone: "",
      landmark: "",
    };
  }
  
  export function makeForm(transport = "motorbike"): OrderFormData {
    return {
      transportType: transport,
      locationPoints: [makePoint("pickup", 0), makePoint("dropoff", 0)],
      packageDescription: "",
      packageWeight: "",
      packageDimensions: "",
      specialInstructions: "",
      packageImages: [],
      isFragile: false,
      requiresRefrigeration: false,
      loadingEquipmentNeeded: false,
      isExpress: false,
      isDocuments: false,
      truckType: "",
      shipmentCategory: "",
      numberOfPieces: "",
      shipmentValue: "",
    };
  }
  
  // ─── Validation ───────────────────────────────────────────────────────────────
  
  export function validate(form: OrderFormData): ValidationErrors {
    const errors: ValidationErrors = {};
  
    form.locationPoints
      .filter(p => p.type === "pickup")
      .forEach((p, i) => {
        if (!p.streetName.trim())       errors[`pu_${i}_street`]    = "الشارع مطلوب";
        if (!p.scheduledDateTime.trim())errors[`pu_${i}_scheduled`] = "موعد الوصول للالتقاط مطلوب";
        if (!p.contactPhone.trim())     errors[`pu_${i}_contact`]   = "رقم جهة اتصال عند الالتقاط مطلوب";
        if (!p.landmark.trim())         errors[`pu_${i}_landmark`]  = "معلم قريب مطلوب لتحديد الموقع";
      });
  
    form.locationPoints
      .filter(p => p.type === "dropoff")
      .forEach((p, i) => {
        if (!p.streetName.trim())   errors[`do_${i}_street`]   = "الشارع مطلوب";
        if (!p.building.trim())     errors[`do_${i}_building`] = "الدور/الشقة مطلوب للتوصيل";
        if (!p.landmark.trim())     errors[`do_${i}_landmark`] = "معلم قريب مطلوب لتحديد الموقع";
        if (!p.recipientName.trim())errors[`do_${i}_rname`]    = "اسم المستلم مطلوب";
        if (!p.recipientPhone.trim())errors[`do_${i}_rphone`] = "جوال المستلم مطلوب";
      });
  
    if (!form.packageDescription.trim()) errors.desc              = "وصف الشحنة مطلوب";
    if(form.packageDescription.trim().length<50) errors.desc              = "وصف الشحنة يجب أن يكون أطول من 50 حرف";
    if (!form.packageWeight.trim())       errors.weight            = "الوزن مطلوب";
    if (!form.shipmentCategory.trim())    errors.shipmentCategory  = "نوع الشحنة مطلوب";
    if (!form.numberOfPieces.trim())      errors.numberOfPieces    = "عدد القطع/الصناديق مطلوب";
  
    return errors;
  }
  
  export function calcCompletion(form: OrderFormData): number {
    const errors = validate(form);
    const pickupCount  = form.locationPoints.filter(p => p.type === "pickup").length;
    const dropoffCount = form.locationPoints.filter(p => p.type === "dropoff").length;
    const total = 4 + pickupCount * 4 + dropoffCount * 5 + 4;
    return Math.round(Math.max(0, (total - Object.keys(errors).length) / total * 100));
  }
  
  // ─── Pricing ──────────────────────────────────────────────────────────────────
  
  export function calcPricing(form: OrderFormData): PricingBreakdown {
    const isMotorbike = form.transportType === "motorbike";
    const distanceKm  = 8.5; // Replace with real geo calc
  
    const base = Math.round(Math.max(15, distanceKm * (isMotorbike ? 2.5 : 5)) * 100) / 100;
  
    const extras =
      (form.isExpress              ? 20 : 0) +
      (form.requiresRefrigeration  ? 15 : 0) +
      (form.loadingEquipmentNeeded ? 25 : 0);
  
    const platformFee = Math.round(base * 0.1 * 100) / 100;
    const subtotal    = Math.round((base + extras + platformFee) * 100) / 100;
    const vat         = Math.round(subtotal * 0.15 * 100) / 100;
    const total       = Math.round((subtotal + vat) * 100) / 100;
  
    return { base, platformFee, extras, subtotal, vat, total, distanceKm };
  }
  
  // ─── Session helpers ──────────────────────────────────────────────────────────
  
  export const SESSION_KEYS = {
    routeSegments:   "routeSegments",
    orderPricing:    "orderPricing",
    lastOrderId:     "lastOrderId",
    lastOrderData:   "lastOrderData",
    offerBooking:    "offerBooking",
    autoSelectModal: "autoSelectModalOpen",
  } as const;
  
  export function clearOrderSession(): void {
    if (typeof window === "undefined") return;
    Object.values(SESSION_KEYS).forEach(k => sessionStorage.removeItem(k));
    sessionStorage.removeItem("multiDirectionOrder");
    sessionStorage.removeItem("pickAndOrderDetails");
  }
  
  export function readSession<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }