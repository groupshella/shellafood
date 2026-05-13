"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/providers";
import { FaTimes, FaMapMarkerAlt, FaHome, FaBuilding, FaStore, FaSave, FaMap, FaSpinner } from "react-icons/fa";
import MapSelectionModal from "./MapSelectionModal";
import { DEFAULT_SERVICE_LAT, DEFAULT_SERVICE_LNG } from "@/shared/constants/location.constants";

const LOCATION_COOKIE_KEY = "user_location";

function coordsFromCookie(): { lat: string; lng: string } | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.split("; ").find((row) => row.startsWith(`${LOCATION_COOKIE_KEY}=`));
	if (!match) return null;
	const value = decodeURIComponent(match.split("=")[1]);
	const [lat, lng] = value.split(",").map(Number);
	if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
	return { lat: String(lat), lng: String(lng) };
}

function defaultCoordsForAddress(): { lat: string; lng: string } {
	return coordsFromCookie() ?? {
		lat: String(DEFAULT_SERVICE_LAT),
		lng: String(DEFAULT_SERVICE_LNG),
	};
}

interface Address {
	id: number;
	address_type: string;
	contact_person_number: string;
	address: string;
	latitude: string;
	longitude: string;
	user_id: number;
	contact_person_name: string;
	created_at: string;
	updated_at: string;
	zone_id: number;
	floor: string | null;
	road: string | null;
	house: string | null;
	zone_ids: number[];
}

interface AddEditAddressModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (address: any) => void;
	editingAddress?: Address | null;
	isLoading: boolean;
}

export default function AddEditAddressModal({ isOpen, onClose, onSave, editingAddress, isLoading }: AddEditAddressModalProps) {
	const { language } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	const [formData, setFormData] = useState({
		address_type: "home",
		contact_person_name: "",
		contact_person_number: "",
		address: "",
		latitude: "",
		longitude: "",
		road: "",
		house: "",
		floor: ""
	});
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	useEffect(() => {
		if (editingAddress) {
			setFormData({
				address_type: editingAddress.address_type,
				contact_person_name: editingAddress.contact_person_name,
				contact_person_number: editingAddress.contact_person_number,
				address: editingAddress.address,
				latitude: editingAddress.latitude,
				longitude: editingAddress.longitude,
				road: editingAddress.road || "",
				house: editingAddress.house || "",
				floor: editingAddress.floor || ""
			});
		} else {
			setFormData({
				address_type: "home",
				contact_person_name: "",
				contact_person_number: "",
				address: "",
				latitude: "",
				longitude: "",
				road: "",
				house: "",
				floor: ""
			});
		}
	}, [editingAddress, isOpen]);

	const handleInputChange = (field: string, value: string | number) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleMapSelection = (addressData: { address: string; details: string; coordinates: { lat: number; lng: number } }) => {
		setFormData(prev => ({
			...prev,
			address: addressData.address,
			latitude: addressData.coordinates.lat.toString(),
			longitude: addressData.coordinates.lng.toString()
		}));
		setIsMapModalOpen(false);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Clean phone number (remove any non-numeric characters except +)
		const cleanedPhone = formData.contact_person_number.replace(/[^\d+]/g, '');

		const { lat: fbLat, lng: fbLng } = defaultCoordsForAddress();
		onSave({
			...formData,
			contact_person_number: cleanedPhone,
			latitude: formData.latitude.trim() || fbLat,
			longitude: formData.longitude.trim() || fbLng,
			// Convert empty strings to null for optional fields
			road: formData.road || undefined,
			house: formData.house || undefined,
			floor: formData.floor || undefined
		});
	};

	const addressTypes = [
		{ value: "home", label: isArabic ? "المنزل" : "Home", icon: FaHome },
		{ value: "work", label: isArabic ? "العمل" : "Work", icon: FaBuilding },
		{ value: "store", label: isArabic ? "المتجر" : "Store", icon: FaStore },
		{ value: "other", label: isArabic ? "أخرى" : "Other", icon: FaMapMarkerAlt }
	];

	if (!isOpen || !mounted) return null;

	const modalContent = (
		<div
			className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-[9999] animate-in fade-in duration-200"
			dir={direction}
			onClick={onClose}
		>
			<div
				className="bg-white dark:bg-gray-800 rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Mobile Drag Handle */}
				<div className="sm:hidden w-full pt-3 pb-2 flex justify-center flex-shrink-0">
					<div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
				</div>

				{/* Modal Header - Sticky */}
				<div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0 shadow-sm">
					<h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
						{editingAddress
							? (isArabic ? "تعديل العنوان" : "Edit Address")
							: (isArabic ? "إضافة عنوان جديد" : "Add New Address")
						}
					</h2>
					<button
						onClick={onClose}
						className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 rounded-xl transition-all touch-manipulation"
						aria-label={isArabic ? "إغلاق" : "Close"}
					>
						<FaTimes className="text-lg sm:text-xl" />
					</button>
				</div>

				{/* Modal Body - Scrollable */}
				<form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6 flex-1 overflow-y-auto">
					{/* Address Type */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
							{isArabic ? "نوع العنوان" : "Address Type"}
						</label>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
							{addressTypes.map((type) => {
								const Icon = type.icon;
								return (
									<button
										key={type.value}
										type="button"
										onClick={() => handleInputChange('address_type', type.value)}
										className={`flex flex-col items-center p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 touch-manipulation ${formData.address_type === type.value
												? 'border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 shadow-sm'
												: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
											}`}
									>
										<Icon className="text-lg sm:text-xl mb-2" />
										<span className="text-xs sm:text-sm font-medium text-center">{type.label}</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Contact Person Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "اسم جهة الاتصال" : "Contact Person Name"}
						</label>
						<input
							type="text"
							value={formData.contact_person_name}
							onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
							placeholder={isArabic ? "مثال: محمد أحمد" : "e.g., Mohammed Ahmed"}
							className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							required
							dir={direction}
						/>
					</div>

					{/* Phone Number */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "رقم الهاتف" : "Phone Number"}
						</label>
						<input
							type="tel"
							value={formData.contact_person_number}
							onChange={(e) => handleInputChange('contact_person_number', e.target.value)}
							placeholder={isArabic ? "966501234567" : "966501234567"}
							className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
							required
							dir="ltr"
						/>
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{isArabic ? "أدخل الرقم بدون + أو مسافات" : "Enter number without + or spaces"}
						</p>
					</div>

					{/* Main Address - Mobile Optimized */}
					<div>
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{isArabic ? "العنوان الرئيسي" : "Main Address"}
						</label>
						{/* Map Selection Button - Prominent on Mobile */}
						<button
							type="button"
							onClick={() => setIsMapModalOpen(true)}
							className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-4 py-3.5 sm:py-2.5 mb-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 active:scale-[0.98] transition-all text-sm sm:text-xs font-semibold shadow-lg hover:shadow-xl touch-manipulation"
						>
							<FaMap className="text-base sm:text-sm" />
							<span>{isArabic ? "اختيار من الخريطة" : "Select from Map"}</span>
						</button>
						<textarea
							value={formData.address}
							onChange={(e) => handleInputChange('address', e.target.value)}
							placeholder={isArabic ? "أدخل العنوان الرئيسي أو اختر من الخريطة" : "Enter main address or select from map"}
							rows={3}
							className="w-full px-4 py-3 sm:py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
							required
							dir={direction}
						/>
						{/* Selected Location Indicator */}
						{formData.latitude && formData.longitude && (
							<div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
								<FaMapMarkerAlt className="text-xs" />
								<span>{isArabic ? "تم تحديد الموقع على الخريطة" : "Location selected on map"}</span>
							</div>
						)}
					</div>

					{/* Additional Details - Optional */}
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								{isArabic ? "الشارع" : "Road"} <span className="text-gray-400">({isArabic ? "اختياري" : "Optional"})</span>
							</label>
							<input
								type="text"
								value={formData.road}
								onChange={(e) => handleInputChange('road', e.target.value)}
								placeholder={isArabic ? "مثال: شارع الملك فهد" : "e.g., King Fahd Road"}
								className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
								dir={direction}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								{isArabic ? "المبنى" : "House"} <span className="text-gray-400">({isArabic ? "اختياري" : "Optional"})</span>
							</label>
							<input
								type="text"
								value={formData.house}
								onChange={(e) => handleInputChange('house', e.target.value)}
								placeholder={isArabic ? "مثال: 123" : "e.g., 123"}
								className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
								dir={direction}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								{isArabic ? "الطابق" : "Floor"} <span className="text-gray-400">({isArabic ? "اختياري" : "Optional"})</span>
							</label>
							<input
								type="text"
								value={formData.floor}
								onChange={(e) => handleInputChange('floor', e.target.value)}
								placeholder={isArabic ? "مثال: 2" : "e.g., 2"}
								className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
								dir={direction}
							/>
						</div>
					</div>



					{/* Modal Footer - Sticky on Mobile */}
					<div className={`flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky bottom-0 z-10 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-3.5 sm:py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all touch-manipulation shadow-sm"
						>
							{isArabic ? "إلغاء" : "Cancel"}
						</button>
						{isLoading ? (
							<div className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 sm:py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all touch-manipulation shadow-lg hover:shadow-xl">
								<FaSpinner className="animate-spin text-base sm:text-sm" />
								<span>{isArabic ? "جاري الحفظ..." : "Saving..."}</span>
							</div>
						) : (
							<button
								type="submit"
								disabled={isLoading}
								className="flex-1 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3.5 sm:py-2.5 text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all touch-manipulation shadow-lg hover:shadow-xl"
							>
								<FaSave className="text-base sm:text-sm" />
								<span>{isArabic ? "حفظ" : "Save"}</span>
							</button>
						)}
					</div>
				</form>
			</div>

			{/* Map Selection Modal */}
			<MapSelectionModal
				isOpen={isMapModalOpen}
				onClose={() => setIsMapModalOpen(false)}
				onSelectAddress={handleMapSelection}
			/>
		</div>
	);

	return createPortal(modalContent, document.body);
}