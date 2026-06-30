// ─── List item (lightweight, from GET /api/v2/address/list) ───────────────────
export interface AddressListItem {
  id: number;
  address_label: string;
  city: string;
  region: string;
  street_name: string;
  latitude: number;
  longitude: number;
}

// ─── Full detail (from GET /api/v2/address/details/{id}) ──────────────────────
export interface Address {
  id: number;
  latitude: number;
  longitude: number;
  city: string;
  region: string;
  street_name: string;
  address_label: string;
  building_type?: "apartment" | "villa" | "office" | string;
  building_number?: string;
  floor_number?: string;
  apartment_number?: string;
  additional_info?: string;
}

// ─── Create payload (POST /api/v2/address/add) ────────────────────────────────
export interface CreateAddressPayload {
  latitude?: number;
  longitude?: number;
  city: string;
  region: string;
  street_name: string;
  address_label: string;
  building_type?: string;
  building_number?: string;
  floor_number?: string;
  apartment_number?: string;
  additional_info?: string;
}

// ─── Update payload (PUT/PATCH /api/v2/address/{id}) ─────────────────────────
export interface UpdateAddressPayload {
  latitude?: number;
  longitude?: number;
  city?: string;
  region?: string;
  street_name?: string;
  address_label?: string;
  building_type?: string;
  building_number?: string;
  floor_number?: string;
  apartment_number?: string;
  additional_info?: string;
}

export interface UpdateAddressResponse {
  success: boolean;
  message: string;
  address?: Address;
  errors?: Record<string, string[]>;
}

// ─── API responses ─────────────────────────────────────────────────────────────
export interface ListAddressesResponse {
  addresses: AddressListItem[];
}

export interface CreateAddressResponse {
  success: boolean;
  message: string;
  address?: Address;
  errors?: Record<string, string[]>;
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
}

// ─── Map location picked by user ──────────────────────────────────────────────
export interface PickedLocation {
  lat: number;
  lng: number;
  city: string;
  region: string;
  street_name: string;
}
