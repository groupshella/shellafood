"use client";

import React, { useState, useEffect, useCallback, memo, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { MapPin, Navigation, Plus, ChevronDown, Check, Settings, X } from "lucide-react";
import { useLanguage } from "@/providers";
import { useAddresses, type Address } from "@/shared/hooks/useAddresses";
import type { NotificationState } from "@/features/profile/types/profile.types";

import { AddEditAddressModal, MapModal } from "@/features/profile";
import { NotificationDialog } from "@/shared/components/feedback/NotificationDialog/NotificationDialog";
import { fetchLocationAddress } from "@/shared/utils/address";
// ============================================================================
// TYPES
// ============================================================================

interface AddressSelectorProps {
  token: string;
  onAddressChange?: (address: Address | null) => void;
}

interface GeolocationCoordinates {
  lat: number;
  lng: number;
}

// ============================================================================
// HOOKS
// ============================================================================

const LOCATION_COOKIE_KEY = "user_location";

function setLocationCookie(value: { lat: number; lng: number }) {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);

  document.cookie = `${LOCATION_COOKIE_KEY}=${(
	value.lat.toString() + ',' + value.lng.toString()
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}
function getLocationFromCookie(): { lat: number; lng: number } | null {
	if (typeof document === "undefined") return null;
  
	const match = document.cookie
	  .split("; ")
	  .find((row) => row.startsWith("user_location="));
  
	if (!match) return null;
  
	const value = decodeURIComponent(match.split("=")[1]); // "24.6101534,46.5996687"
  
	const [lat, lng] = value.split(",").map(Number);
  
	if (isNaN(lat) || isNaN(lng)) return null;
  
	return { lat, lng };
  }

function useGeolocation() {
  const [isDetecting, setIsDetecting] = useState(false);
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "success",
    show: false,
  });

  const detectLocation = useCallback(
    (): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          setNotification({
            message: isArabic
              ? "المتصفح الخاص بك لا يدعم تحديد الموقع الجغرافي"
              : "Your browser does not support geolocation",
            type: "error",
            show: true,
          });
          resolve(null);
          return;
        }

        setIsDetecting(true);

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
console.log(position);
            // ✅ SAVE LOCATION IN COOKIE
            setLocationCookie(coords);

            setIsDetecting(false);
            resolve(coords);
          },
          (error) => {
            setIsDetecting(false);

            let errorMessage = isArabic
              ? "تعذر الحصول على موقعك"
              : "Unable to get your location";

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = isArabic
                  ? "تم رفض طلب الوصول إلى موقعك"
                  : "Location access denied";
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = isArabic
                  ? "معلومات الموقع غير متاحة"
                  : "Location information is unavailable";
                break;
              case error.TIMEOUT:
                errorMessage = isArabic
                  ? "انتهت مهلة طلب الموقع"
                  : "Location request timed out";
                break;
            }

            setNotification({
              message: errorMessage,
              type: "error",
              show: true,
            });

            resolve(null);
          },
          {
            enableHighAccuracy: true,
            
          }
        );
      });
    },
    [isArabic]
  );

  return { detectLocation, isDetecting, notification, setNotification };
}
// ============================================================================
// MAIN COMPONENT
// ============================================================================
interface LocationResult {
	lat: number;
	lng: number;
	displayName: string;
	country?: string;
	city?: string;
	state?: string;
	district?: string;
	street?: string;
	postcode?: string;
  }
  

function AddressSelector({ token, onAddressChange }: AddressSelectorProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const { detectLocation, isDetecting, notification, setNotification } = useGeolocation();
  // Use the addresses hook
  const {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    fetchAddresses,
  } = useAddresses(1, 100, token);

  // Local state
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressList, setShowAddressList] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [viewingAddress, setViewingAddress] = useState<Address | null>(null);
  const [locationUpdateTrigger, setLocationUpdateTrigger] = useState(0);
  
  // Get location from cookie, will update when locationUpdateTrigger changes
  const location = useMemo(() => getLocationFromCookie(), [locationUpdateTrigger]);
const [locationAddress, setLocationAddress] = useState<LocationResult | null>(null);
  const locationFetchedRef = useRef<string | null>(null);

  // Fetch addresses on mount
  useEffect(() => {

    if (token) {
      fetchAddresses(1);
    }
  }, [token, fetchAddresses]);
  useEffect(() => {
	const fetchLocationAddressEffect = async () => {
		if (!location) return;
		
		// Create a stable key to prevent duplicate fetches
		const locationKey = `${location.lat.toFixed(6)}-${location.lng.toFixed(6)}`;
		
		// Skip if we've already fetched for this exact location
		if (locationFetchedRef.current === locationKey) {
			return;
		}
		
		// Mark as fetching
		locationFetchedRef.current = locationKey;
		
		try {
			const locationAddressResult = await fetchLocationAddress(location);
			if (locationAddressResult) {
				setLocationAddress(locationAddressResult);
			}
		} catch (error) {
			console.error("Error fetching location address:", error);
			locationFetchedRef.current = null; // Reset on error to allow retry
		}
	};
	
	fetchLocationAddressEffect();
  }, [location]); // Use lat/lng instead of the whole object
  // Set default address when addresses load
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      // Find default address or use first one
      const defaultAddr = addresses.find(addr => addr.address_type === 'home') || addresses[0];
      setSelectedAddress(defaultAddr);
      onAddressChange?.(defaultAddr);
    }
  }, [addresses, selectedAddress, onAddressChange]);

  // Handle error display
  useEffect(() => {
    if (error) {
      setNotification({	
        message: isArabic ? "حدث خطأ في تحميل العناوين" : "Error loading addresses",
        type: 'error',
        show: true,
      });
    }
  }, [error, isArabic, setNotification]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDetectLocation = useCallback(async () => {
	const existingLocation = getLocationFromCookie();
	if (existingLocation) {
		setNotification({
			message: isArabic ? "تم تحديد موقعك بنجاح" : "Location detected successfully",
			type: 'success',
			show: true,
		});
		return;
	}
    const coords = await detectLocation();
	console.log(coords);
    if (coords) {
      setNotification({
        message: isArabic ? "تم تحديد موقعك بنجاح" : "Location detected successfully",
        type: 'success',
        show: true,
      });
      // Trigger location update to refetch from cookie
      setLocationUpdateTrigger(prev => prev + 1);
    }
  }, [detectLocation, isArabic, setNotification]);

  const handleSelectDetectedLocation = useCallback(() => {
    if (!location || !locationAddress) return;
    
    // Convert detected location to Address format
    const detectedAddress: Address = {
      id: -1, // Special ID for detected location
      address: locationAddress.displayName,
      latitude: location.lat.toString(),
      longitude: location.lng.toString(),
      contact_person_name: isArabic ? "موقعي الحالي" : "My Current Location",
      contact_person_number: "",
      address_type: "current_location",
      zone_id: 0,
      zone_ids: [],
      road: locationAddress.street || null,
      house: null,
      floor: null,
      user_id: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setSelectedAddress(detectedAddress);
    onAddressChange?.(detectedAddress);
    setNotification({
      message: isArabic ? "تم اختيار موقعك الحالي" : "Current location selected",
      type: 'success',
      show: true,
    });
  }, [location, locationAddress, isArabic, onAddressChange, setNotification]);

  const handleSelectAddress = useCallback(
    (addr: Address) => {
      setSelectedAddress(addr);
      setShowAddressList(false);
      onAddressChange?.(addr);
    },
    [onAddressChange]
  );

  const handleAddressSave = useCallback(
    async (addressData: any) => {
      try {
        if (editingAddress) {
          await updateAddress(editingAddress.id, addressData);
          setNotification({
            message: isArabic ? "تم تحديث العنوان بنجاح" : "Address updated successfully",
            type: 'success',
            show: true,
          });
          setShowAddModal(false);
          setEditingAddress(null);
        } else {
          await addAddress(addressData);
          setNotification({
            message: isArabic ? "تم إضافة العنوان بنجاح" : "Address added successfully",
            type: 'success',
            show: true,
          });
          setShowAddModal(false);
          setEditingAddress(null);
        }
      } catch (error) {
        console.log("error", error);
        const msg =
          error instanceof Error
            ? error.message
            : isArabic
              ? "حدث خطأ في حفظ العنوان"
              : "Error saving address";
        setNotification({
          message: msg,
          type: 'error',
          show: true,
        });
      }
    },
    [editingAddress, addAddress, updateAddress, fetchAddresses, isArabic, setNotification]
  );

  const handleDeleteAddress = useCallback(
    async (addressId: number) => {
      if (window.confirm(isArabic ? "هل تريد حذف هذا العنوان؟" : "Delete this address?")) {
        try {
          await deleteAddress(addressId);
          	setNotification({
            message: isArabic ? "تم حذف العنوان بنجاح" : "Address deleted successfully",
            type: 'success',
            show: true,
          });
          
          // If deleted address was selected, select another one
          if (selectedAddress?.id === addressId) {
            const remainingAddresses = addresses.filter(a => a.id !== addressId);
            const newSelected = remainingAddresses[0] || null;
            setSelectedAddress(newSelected);
            onAddressChange?.(newSelected);
          }
        } catch (error) {
          setNotification({
            message: isArabic ? "حدث خطأ في حذف العنوان" : "Error deleting address",
            type: 'error',
            show: true,
          });
        }
      }
    },
    [deleteAddress, selectedAddress, addresses, isArabic, setNotification, onAddressChange]
  );

  const handleViewMap = useCallback((addr: Address) => {
    setViewingAddress(addr);
    setShowMapModal(true);
    setShowAddressList(false);
  }, []);

  const handleManageAddresses = useCallback(() => {
    router.push("/profile/addresses");
  }, [router]);


  return (
    <>
      <div className="space-y-3 sm:space-y-4 w-full overflow-x-hidden">
        {/* Header */}
        <Header
          isArabic={isArabic}
          addressesCount={addresses.length}
          onManageAddresses={handleManageAddresses}
        />

        {/* Selected Address Display */}
        {selectedAddress && (
          <SelectedAddressCard
            address={selectedAddress}
            addressesCount={addresses.length}
            showAddressList={showAddressList}
            isArabic={isArabic}
            onClick={() => addresses.length > 0 && setShowAddressList(true)}
          />
        )}

{location && locationAddress && (
			<motion.div
				initial={{ opacity: 0, height: 0 }}
				animate={{ opacity: 1, height: "auto" }}
				exit={{ opacity: 0, height: 0 }}
				transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
				className="w-full"
			>
				<LocationResultCard
					location={locationAddress}
					isArabic={isArabic}
					onClick={handleSelectDetectedLocation}
				/>
			</motion.div>
		)} 
        <QuickActions
          isArabic={isArabic}
          isDetecting={isDetecting}
          isLoading={isLoading}
          hasDetectedLocation={!!(location && locationAddress)}
          onDetectLocation={handleDetectLocation}
          onChooseLocation={handleSelectDetectedLocation}
          onAddAddress={() => {
            setEditingAddress(null);
            setShowAddModal(true);
          }}
        />
      </div>

      {/* Address List Modal */}
      <AddressListModal
        isOpen={showAddressList}
        addresses={addresses}
        selectedAddress={selectedAddress}
        isArabic={isArabic}
        onClose={() => setShowAddressList(false)}
        onSelectAddress={handleSelectAddress}
        onAddNew={() => {
          setShowAddressList(false);
          setEditingAddress(null);
          setShowAddModal(true);
        }}
        onEdit={(addr) => {
          setShowAddressList(false);
          setEditingAddress(addr);
          setShowAddModal(true);
        }}
        onDelete={handleDeleteAddress}
        onViewMap={handleViewMap}
      />

      {/* Add/Edit Address Modal */}
      <AddEditAddressModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingAddress(null);
        }}
        onSave={handleAddressSave}
        editingAddress={editingAddress}
        isLoading={isLoading}
      />

      {/* Map Modal */}
      {viewingAddress && (
        <MapModal
          isOpen={showMapModal}
          onClose={() => {
            setShowMapModal(false);
            setViewingAddress(null);
          }}
          address={viewingAddress}
        />
      )}
	  <NotificationDialog
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ message: '', type: 'success', show: false })}
        isArabic={isArabic}
      />
	    </>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface HeaderProps {
  isArabic: boolean;
  addressesCount: number;
  onManageAddresses: () => void;
}

const Header = memo(({ isArabic, addressesCount, onManageAddresses }: HeaderProps) => (
  <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex-shrink-0">
        <MapPin className="h-5 w-5 sm:h-6 sm:h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs sm:text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 truncate ${isArabic ? "text-right" : "text-left"}`}>
          {isArabic ? "عنوان التوصيل" : "Delivery Address"}
        </p>
        <p className={`text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 line-clamp-1 ${isArabic ? "text-right" : "text-left"}`}>
          {isArabic ? "اختر عنوانك" : "Select your address"}
        </p>
      </div>
    </div>
    {addressesCount > 0 && (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onManageAddresses}
        className="p-2 sm:p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
        title={isArabic ? "إدارة العناوين" : "Manage Addresses"}
      >
        <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>
    )}
  </div>
));

Header.displayName = "Header";

interface SelectedAddressCardProps {
  address: Address;
  addressesCount: number;
  showAddressList: boolean;
  isArabic: boolean;
  onClick: () => void;
}

const SelectedAddressCard = memo(({ address, addressesCount, showAddressList, isArabic, onClick }: SelectedAddressCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className={`p-3 sm:p-4 md:p-5 border-2 border-green-500 dark:border-green-600 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 ${addressesCount > 1 ? 'cursor-pointer hover:shadow-md' : ''} transition-all ${isArabic ? "text-right" : "text-left"}`}
  >
    <div className="flex items-start justify-between gap-2 sm:gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-green-600 dark:border-green-500 flex items-center justify-center">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-600 dark:bg-green-500" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm md:text-base truncate">
            {address.contact_person_name}
          </span>
          <span className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium">
            {address.address_type}
          </span>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-2">
          {address.address}
        </p>
        {(address.road || address.house || address.floor) && (
          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
            {[address.road, address.house, address.floor].filter(Boolean).join(" • ")}
          </p>
        )}
      </div>
      {addressesCount > 1 && (
        <ChevronDown
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 transition-transform ${showAddressList ? "rotate-180" : ""}`}
        />
      )}
    </div>
  </motion.div>
));

SelectedAddressCard.displayName = "SelectedAddressCard";

interface QuickActionsProps {
  isArabic: boolean;
  isDetecting: boolean;
  isLoading: boolean;
  hasDetectedLocation: boolean;
  onDetectLocation: () => void;
  onChooseLocation: () => void;
  onAddAddress: () => void;
}

const QuickActions = memo(({ isArabic, isDetecting, isLoading, hasDetectedLocation, onDetectLocation, onChooseLocation, onAddAddress }: QuickActionsProps) => {
  return (
  <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
    {!hasDetectedLocation ? (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDetectLocation}
        disabled={isDetecting || isLoading}
        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDetecting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
            />
            <span>{isArabic ? "جاري الكشف..." : "Detecting..."}</span>
          </>
        ) : (
          <>
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>{isArabic ? "اكتشف موقعي" : "Detect Location"}</span>
          </>
        )}
      </motion.button>
    ) : (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onChooseLocation}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>{isArabic ? "اختر موقعي" : "Choose My Location"}</span>
      </motion.button>
    )}

    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onAddAddress}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 bg-white dark:bg-gray-800 border-2 border-green-500 dark:border-green-600 text-green-600 dark:text-green-400 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base min-h-[44px] disabled:opacity-50"
    >
      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
      <span>{isArabic ? "إضافة عنوان" : "Add Address"}</span>
      </motion.button>
	
    </div>
  );
});

QuickActions.displayName = "QuickActions";

interface AddressListModalProps {
  isOpen: boolean;
  addresses: Address[];
  selectedAddress: Address | null;
  isArabic: boolean;
  onClose: () => void;
  onSelectAddress: (address: Address) => void;
  onAddNew: () => void;
  onEdit: (address: Address) => void;
  onDelete: (addressId: number) => void;
  onViewMap: (address: Address) => void;
}

const AddressListModal = memo(({ isOpen, addresses, selectedAddress, isArabic, onClose, onSelectAddress, onAddNew }: AddressListModalProps) => (
  <AnimatePresence>
    {isOpen && addresses.length > 0 && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden pointer-events-auto border border-gray-200 dark:border-gray-700"
            dir={isArabic ? "rtl" : "ltr"}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                {isArabic ? "اختر العنوان" : "Select Address"}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Address List */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(85vh-180px)] space-y-2 sm:space-y-3">
              {addresses.map((addr, index) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <motion.div
                    key={addr.id}
                    initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => onSelectAddress(addr)}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-green-600" : "border-gray-300"
                          }`}>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 rounded-full bg-green-600"
                              />
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                            {addr.contact_person_name}
                          </span>
                          <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                            {addr.address_type}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {addr.address}
                        </p>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onAddNew}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>{isArabic ? "إضافة عنوان جديد" : "Add New Address"}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
));

AddressListModal.displayName = "AddressListModal";
const LocationResultCard = memo(
	({ location, isArabic, onClick }: { location: LocationResult; isArabic: boolean; onClick: () => void }) => {
	  return (
		<motion.div
		  initial={{ opacity: 0, y: 20, scale: 0.95 }}
		  animate={{ opacity: 1, y: 0, scale: 1 }}
		  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
		  whileHover={{ 
			scale: 1.02, 
			y: -4,
			transition: { duration: 0.2 }
		  }}
		  whileTap={{ scale: 0.98 }}
		  onClick={onClick}
		  className={`group relative w-full overflow-hidden
			rounded-2xl sm:rounded-3xl
			bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40
			dark:from-gray-800 dark:via-green-900/20 dark:to-emerald-900/20
			backdrop-blur-xl
			border-2 border-green-200/60 dark:border-green-700/40
			shadow-lg hover:shadow-2xl hover:shadow-green-500/20
			cursor-pointer
			transition-all duration-300
			${isArabic ? "text-right" : "text-left"}
			before:absolute before:inset-0 before:bg-gradient-to-br before:from-green-500/5 before:via-transparent before:to-emerald-500/5
			before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300`}
		>
		  {/* Animated background gradient */}
		  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-transparent to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
		  
		  {/* Content */}
		  <div className="relative p-4 sm:p-5 md:p-6">
			<div className="flex items-start justify-between gap-3 sm:gap-4">
			  <div className="flex-1 min-w-0 space-y-3">
				{/* Header with Icon and Badge */}
				<div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
				  {/* GPS Icon with Pulse Animation */}
				  <motion.div
					animate={{ 
					  scale: [1, 1.1, 1],
					  rotate: [0, 5, -5, 0]
					}}
					transition={{ 
					  duration: 2,
					  repeat: Infinity,
					  repeatDelay: 3,
					  ease: "easeInOut"
					}}
					className="relative flex-shrink-0"
				  >
					<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl
					  bg-gradient-to-br from-green-500 to-emerald-600
					  dark:from-green-600 dark:to-emerald-700
					  shadow-lg shadow-green-500/30
					  flex items-center justify-center
					  group-hover:shadow-xl group-hover:shadow-green-500/40
					  transition-all duration-300">
					  <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
				</div>
					{/* Pulse ring effect */}
					<motion.div
					  animate={{ 
						scale: [1, 1.5, 1.5],
						opacity: [0.6, 0, 0]
					  }}
					  transition={{ 
						duration: 2,
						repeat: Infinity,
						repeatDelay: 3,
						ease: "easeOut"
					  }}
					  className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-green-400/50"
					/>
				  </motion.div>

				  {/* Title and GPS Badge */}
				  <div className="flex items-center gap-2 flex-1 min-w-0">
					<h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 dark:text-white truncate">
					  {isArabic ? "موقعي الحالي" : "My Current Location"}
					</h3>
					<motion.span
					  whileHover={{ scale: 1.1 }}
					  className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5
						bg-gradient-to-r from-emerald-500 to-green-500
						text-white text-[10px] sm:text-xs font-bold
						rounded-full sm:rounded-lg
						shadow-md shadow-emerald-500/30
						backdrop-blur-sm
						whitespace-nowrap">
					  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white animate-pulse" />
				  GPS
					</motion.span>
				  </div>
			  </div>
  
				{/* Address Text */}
				<div className="space-y-2">
				  <p className="text-sm sm:text-base md:text-lg 
					text-gray-800 dark:text-gray-100 
					font-medium leading-relaxed 
					line-clamp-2 sm:line-clamp-3
					group-hover:text-gray-900 dark:group-hover:text-white
					transition-colors duration-200">
				{location.displayName}
			  </p>
  
				  {/* Location Details */}
			  {(location.city || location.state || location.country) && (
					<div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
					  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
					  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
				  {[location.city, location.state, location.country].filter(Boolean).join(" • ")}
				</p>
					</div>
			  )}
  
				  {/* Coordinates - Subtle */}
				  <div className="flex items-center gap-1.5 pt-1">
					<div className="w-1 h-1 rounded-full bg-green-500/60" />
					<p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 font-mono">
				{location.lat.toFixed(6)}, {location.lng.toFixed(6)}
			  </p>
				  </div>
				</div>
			  </div>

			  {/* Action Indicator */}
			  <motion.div
				className="flex-shrink-0 pt-1"
				whileHover={{ x: isArabic ? -4 : 4 }}
				transition={{ type: "spring", stiffness: 400, damping: 17 }}
			  >
				<div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl
				  bg-gradient-to-br from-green-100 to-emerald-100
				  dark:from-green-900/40 dark:to-emerald-900/40
				  border border-green-200/50 dark:border-green-700/50
				  flex items-center justify-center
				  group-hover:from-green-200 group-hover:to-emerald-200
				  dark:group-hover:from-green-800/60 dark:group-hover:to-emerald-800/60
				  transition-all duration-300">
				  <ChevronDown
					className={`w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400
					  transition-transform duration-300
					  group-hover:scale-110
					  ${isArabic ? "rotate-180" : ""}`}
				  />
				</div>
			  </motion.div>
			</div>
  
			{/* Bottom accent line */}
			<motion.div
			  className="absolute bottom-0 left-0 right-0 h-1
				bg-gradient-to-r from-green-500 via-emerald-500 to-green-500
				opacity-0 group-hover:opacity-100
				transition-opacity duration-300"
			  initial={{ scaleX: 0 }}
			  whileHover={{ scaleX: 1 }}
			  transition={{ duration: 0.3 }}
			/>
		  </div>
		</motion.div>
	  );
	}
  );
  

  LocationResultCard.displayName = "LocationResultCard";

export default memo(AddressSelector);