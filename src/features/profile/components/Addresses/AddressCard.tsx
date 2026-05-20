"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaEdit, FaTrash, FaHome, FaBuilding, FaStore, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";

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

interface AddressCardProps {
	address: Address;
	onEdit: (address: Address) => void;
	onDelete: (address: Address) => void;
	onViewMap: (address: Address) => void;
	isArabic: boolean;
}

export default function AddressCard({ address, onEdit, onDelete, onViewMap, isArabic }: AddressCardProps) {
	const direction = isArabic ? 'rtl' : 'ltr';

	const getAddressIcon = (type: string) => {
		switch (type) {
			case "home":
				return FaHome;
			case "work":
				return FaBuilding;
			case "store":
				return FaStore;
			default:
				return FaMapMarkerAlt;
		}
	};

	const getAddressTypeColor = (type: string) => {
		switch (type) {
			case "home":
				return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
			case "work":
				return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400";
			case "store":
				return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
			default:
				return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
		}
	};

	const getAddressTypeLabel = (type: string) => {
		const labels: Record<string, { ar: string; en: string }> = {
			home: { ar: "منزل", en: "Home" },
			work: { ar: "عمل", en: "Work" },
			store: { ar: "متجر", en: "Store" },
		};
		return labels[type]?.[isArabic ? 'ar' : 'en'] || type;
	};

	const handleEdit = () => {
		onEdit(address);
	};

	const handleDelete = () => {
		onDelete(address);
	};

	const handleViewMap = () => {
		onViewMap(address);
	};

	const Icon = getAddressIcon(address.address_type);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.2 }}
			className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 hover:shadow-md transition-all duration-200 hover:border-green-200 dark:hover:border-green-800 w-full overflow-x-hidden"
			dir={direction}
		>
			{/* Address Header */}
			<div className={`flex flex-col  sm:items-start sm:justify-between mb-4 sm:mb-5 gap-3 `}>

				<div className={`flex items-start gap-3 flex-1 min-w-0 `}>
					<div className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl flex items-center justify-center ${getAddressTypeColor(address.address_type)} shadow-sm flex-shrink-0`}>
						<Icon className="text-base sm:text-lg md:text-xl" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<div className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
							<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg md:text-xl truncate">
								{getAddressTypeLabel(address.address_type)}
							</h3>
						</div>
						<p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed line-clamp-2">
							{address.address}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className={`flex gap-2 self-end sm:self-auto `}>
					<button
						onClick={handleEdit}
						className="p-2.5 sm:p-2.5 md:p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
						title={isArabic ? "تعديل" : "Edit"}
						aria-label={isArabic ? "تعديل" : "Edit"}
					>
						<FaEdit className="text-sm sm:text-base" />
					</button>
					<button
						onClick={handleDelete}
						className="p-2.5 sm:p-2.5 md:p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
						title={isArabic ? "حذف" : "Delete"}
						aria-label={isArabic ? "حذف" : "Delete"}
					>
						<FaTrash className="text-sm sm:text-base" />
					</button>
				</div>
			</div>

			{/* Address Details */}
			<div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5 md:mb-6">
				<div className={`flex items-start gap-2.5 sm:gap-3 `}>
					<div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1">
							{isArabic ? "اسم جهة الاتصال:" : "Contact Person:"}
						</p>
						<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
							{address.contact_person_name}
						</p>
					</div>
				</div>
				<div className={`flex items-center gap-2.5 sm:gap-3 `}>
					<div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
						<FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm" />
					</div>
					<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
						<p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1">
							{isArabic ? "رقم الهاتف:" : "Phone Number:"}
						</p>
						<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
							{address.contact_person_number}
						</p>
					</div>
				</div>
				{(address.floor || address.road || address.house) && (
					<div className={`flex items-start gap-2.5 sm:gap-3 `}>
						<div className="h-8 w-8 sm:h-9 sm:w-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
							<FaMapMarkerAlt className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm" />
						</div>
						<div className={`flex-1 min-w-0 ${isArabic ? 'text-right' : 'text-left'}`}>
							<p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium mb-1">
								{isArabic ? "تفاصيل إضافية:" : "Additional Details:"}
							</p>
							<p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
								{[address.road, address.house, address.floor].filter(Boolean).join(', ')}
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className={`flex flex-col sm:flex-row gap-2.5 sm:gap-3 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
				<button
					onClick={handleViewMap}
					className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-2.5 md:py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-xs sm:text-sm touch-manipulation min-h-[44px] sm:min-h-0 flex-1 sm:flex-initial `}
				>
					<FaEye className="text-xs sm:text-sm" />
					<span>{isArabic ? "عرض على الخريطة" : "View on Map"}</span>
				</button>
			</div>
		</motion.div>
	);
}