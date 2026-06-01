/**
 * Pick & Order Feature Types
 * 
 * Centralized type definitions for the pick-and-order feature.
 * All types are organized by domain for better maintainability.
 * 
 * @module features/pick-and-order/types
 */

// ============================================================================
// Core Domain Types
// ============================================================================

export type TransportType = "motorbike" | "truck";
export type OrderType = "one-way" | "multi-direction";
export type OrderStatus = 
	| "pending"
	| "assigned"
	| "picked_up"
	| "in_transit"
	| "delivered"
	| "completed"
	| "cancelled";

// ============================================================================
// Location & Address Types
// ============================================================================

export interface LocationPoint {
	id: string;
	type: "pickup" | "dropoff";
	label: string;
	location: { lat: number; lng: number } | null;
	streetName: string;
	areaName: string;
	city: string;
	building: string;
	additionalDetails: string;
	buildingPhoto: string | null;
	contactName: string;
	contactPhone: string;
}

export interface Address {
	id?: string;
	address: string;
	formattedAddress?: string;
	lat?: number;
	lng?: number;
	label?: string;
	phone?: string;
	notes?: string;
}

export interface ParsedAddress {
	street: string;
	area: string;
	city: string;
	building: string;
	fullAddress: string;
}

// ============================================================================
// Package & Route Segment Types
// ============================================================================

export interface PackageDetails {
	description: string;
	weight: string;
	dimensions: string;
	specialInstructions: string;
	images: string[];
	video: string | null;
	isFragile: boolean;
	requiresRefrigeration: boolean;
}

export interface SimplePackageDetails {
	weight: number;
	images?: string[];
	dimensions?: {
		length: number;
		width: number;
		height: number;
	};
	description?: string;
	value?: number;
	fragile?: boolean;
}

export interface RouteSegment {
	id: string;
	pickupPoint: LocationPoint;
	dropoffPoint: LocationPoint;
	packageDetails: PackageDetails;
	status?: "pending" | "in_progress" | "completed";
	vehicleSpecificFields?: VehicleSpecificFields;
}

// ============================================================================
// Vehicle Types
// ============================================================================

export interface VehicleSpecificFields {
	// Motorbike specific
	hasBox?: boolean;
	boxSize?: "small" | "medium" | "large";
	
	// Truck specific
	requiresLift?: boolean;
	requiresHelper?: boolean;
	floorNumber?: number;
}

export interface VehicleOptions {
	truckType: string;
	cargoType?: string;
	isFragile?: boolean;
	requiresRefrigeration?: boolean;
	loadingEquipmentNeeded: boolean;
	deliveryPreference: "standard" | "express" | "scheduled";
	scheduledTime?: Date;
	additionalEquipment: {
		loadingRamp: boolean;
		straps: boolean;
		movingBlankets: boolean;
	};
}

export interface MotorbikeOptions {
	packageType: string;
	isDocuments: boolean;
	isExpress: boolean;
}

// ============================================================================
// Driver Types
// ============================================================================

export interface Driver {
	id: string;
	name: string;
	nameAr: string;
	avatar: string;
	rating: number;
	reviewsCount: number;
	pricePerKm: number;
	experience: string;
	vehicleType: TransportType;
	vehicleModel: string;
	licensePlate: string;
	phone: string;
	completedOrders: number;
	joinDate: string;
	specialties: string[];
	bio?: string;
	bioAr?: string;
	verified: boolean;
	responseTime?: string;
	acceptanceRate?: number;
	// Additional fields for driver selection
	isAvailable?: boolean;
	distance?: number;
	estimatedArrival?: string;
	// Chat-related fields
	online?: boolean;
	lastSeen?: Date;
}

export interface Message {
	id: string;
	senderId: string;
	text: string;
	timestamp: Date;
	status: "sent" | "delivered" | "read";
}

// ============================================================================
// Order Types
// ============================================================================

export interface OrderData {
	id?: string;
	transportType: TransportType;
	orderType: OrderType;
	segments: RouteSegment[];
	selectedDriverId?: string;
	paymentMethod?: string;
	totalPrice?: number;
	status?: OrderStatus;
	createdAt?: string;
}

export interface MultiDirectionOrder {
	transportType: string;
	orderType: string;
	routeSegments: RouteSegment[];
	vehicleOptions: VehicleOptions | MotorbikeOptions;
	currentStep: number;
	currentSegmentIndex: number;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface PaymentMethod {
	id: string;
	name: string;
	nameAr?: string;
	icon?: string;
	isAvailable: boolean;
}

export interface PaymentMethodUI {
	id: string;
	icon: React.ComponentType<{ className?: string }>;
	titleEn: string;
	titleAr: string;
	descriptionEn: string;
	descriptionAr: string;
	buttonTextEn: string;
	buttonTextAr: string;
}

// ============================================================================
// Pricing Types
// ============================================================================

export interface PricingBreakdown {
	basePrice: number;
	platformFee: number;
	subtotal: number;
	vat: number;
	total: number;
	distance: number; // in kilometers
}

export interface OrderPricingData {
	transportType: TransportType;
	locationPoints: Array<{
		location: { lat: number; lng: number } | null;
	}>;
	isExpress?: boolean;
	requiresRefrigeration?: boolean;
	loadingEquipmentNeeded?: boolean;
}

// ============================================================================
// API & Response Types
// ============================================================================

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export interface NotificationState {
	show: boolean;
	message: string;
	type: 'success' | 'error' | 'info';
}

export interface ValidationErrors {
	[key: string]: string;
}

// ============================================================================
// Legacy Type Aliases (for backward compatibility)
// ============================================================================

export type LocationPointType = LocationPoint;
export type PackageDetailsType = PackageDetails;
export type LocationPointRouteSegment = LocationPoint;
