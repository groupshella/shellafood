"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/providers";
import { MapPin, Plus, Check, X, ChevronDown } from "lucide-react";
import { AddEditAddressModal, MapModal } from "@/features/profile";
import type { Address } from "../../types/cart.types";
import type { UseAddressReturn } from "../../hooks/useAddress";

interface AddressSelectorProps {
	language: "en" | "ar";
	addresses: Address[];
	selectedAddressId: string | null;
	isLoading: boolean;
	onAddressSelect: (addressId: string) => void;
	onSaveAddress: (addressData: any) => Promise<boolean>;
	onDeleteAddress: (addressId: string) => Promise<boolean>;
}

export default function AddressSelector({
	language,
	addresses,
	selectedAddressId,
	isLoading,
	onAddressSelect,
	onSaveAddress,
	onDeleteAddress,
}: AddressSelectorProps) {
	const { language: contextLanguage } = useLanguage();
	const isArabic = (language || contextLanguage) === "ar";

	const [showAddressList, setShowAddressList] = useState(false);
	const [showAddModal, setShowAddModal] = useState(false);
	const [showMapModal, setShowMapModal] = useState(false);
	const [selectedAddressForMap, setSelectedAddressForMap] = useState<Address | null>(null);

	const selectedAddress = addresses.find((a) => a.id.toString() === selectedAddressId?.toString()) || addresses[0];

	const handleAddressSelect = (addressId: string) => {
		onAddressSelect(addressId);
		setShowAddressList(false);
	};

	const handleAddressSave = async (addressData: any) => {
		console.log("addressData", addressData);
		console.log("selectedAddressForMap", selectedAddressForMap);
		const success = await onSaveAddress({
			address: addressData.address || addressData.formattedAddress || '',
			formattedAddress: addressData.formattedAddress,
			lat: addressData.coordinates?.lat || addressData.lat,
			lng: addressData.coordinates?.lng || addressData.lng,
		});
		if (success) {
			setShowAddModal(false);
		}
	};

	const handleDeleteAddress = async (addressId: string) => {
		const confirmed = window.confirm(
			isArabic 
				? "هل أنت متأكد من حذف هذا العنوان؟" 
				: "Are you sure you want to delete this address?"
		);
		
		if (confirmed) {
			await onDeleteAddress(addressId);
		}
	};

	const handleViewOnMap = (address: Address) => {
		setSelectedAddressForMap(address);
		setShowMapModal(true);
	};

	const closeMapModal = () => {
		setShowMapModal(false);
		setSelectedAddressForMap(null);
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
			>
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-2">
						<MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
						<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
							{isArabic ? "عنوان التوصيل" : "Delivery Address"}
						</h3>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => setShowAddModal(true)}
						className={`flex items-center gap-2 px-3 py-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors text-sm font-semibold ${isArabic ? "flex-row-reverse" : ""}`}
					>
						<Plus className="w-4 h-4" />
						<span>{isArabic ? "إضافة عنوان" : "Add Address"}</span>
					</motion.button>
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
				) : selectedAddress ? (
					<AddressDisplay
						address={selectedAddress}
						addresses={addresses}
						isArabic={isArabic}
						showAddressList={showAddressList}
						onAddressCardClick={() => addresses.length > 1 && setShowAddressList(true)}
						onViewOnMap={() => handleViewOnMap(selectedAddress)}
					/>
				) : (
					<EmptyAddressState
						isArabic={isArabic}
						onAddClick={() => setShowAddModal(true)}
					/>
				)}
			</motion.div>

			{/* Address List Modal */}
			<AddressListModal
				isOpen={showAddressList}
				addresses={addresses}
				currentSelectedId={selectedAddressId}
				isArabic={isArabic}
				onClose={() => setShowAddressList(false)}
				onAddressSelect={handleAddressSelect}
				onViewOnMap={(address) => {
					handleViewOnMap(address);
					setShowAddressList(false);
				}}
				onDelete={handleDeleteAddress}
				onAddNew={() => {
					setShowAddressList(false);
					setShowAddModal(true);
				}}
			/>

			{/* Add/Edit Address Modal */}
			<AddEditAddressModal
				isOpen={showAddModal}
				onClose={() => setShowAddModal(false)}
				onSave={handleAddressSave}
				editingAddress={null}
				isLoading={false}
			/>

			{/* Map Modal */}
			{selectedAddressForMap && selectedAddressForMap.lat && selectedAddressForMap.lng && (
				<MapModal
					isOpen={showMapModal}
					onClose={closeMapModal}
					address={{
						id: selectedAddressForMap.id,
						address_type: 'delivery',
						contact_person_number: '',
						address: selectedAddressForMap.address || selectedAddressForMap.formattedAddress || '',
						latitude: selectedAddressForMap.lat.toString(),
						longitude: selectedAddressForMap.lng.toString(),
						user_id: 0,
						contact_person_name: 'Delivery Address',
						created_at: selectedAddressForMap.createdAt || new Date().toISOString(),
						updated_at: selectedAddressForMap.createdAt || new Date().toISOString(),
						zone_id: 0,
						floor: null,
						road: null,
						house: null,
						zone_ids: [],
					}}
				/>
			)}
		</>
	);
}

interface AddressDisplayProps {
	address: Address;
	addresses: Address[];
	isArabic: boolean;
	showAddressList: boolean;
	onAddressCardClick: () => void;
	onViewOnMap: () => void;
}

function AddressDisplay({
	address,
	addresses,
	isArabic,
	showAddressList,
	onAddressCardClick,
	onViewOnMap,
}: AddressDisplayProps) {
	return (
		<div className="space-y-3">
			{/* Selected Address Card */}
			<motion.div
				whileHover={{ scale: 1.01 }}
				onClick={onAddressCardClick}
				className={`p-4 border-2 border-emerald-500 dark:border-emerald-600 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 ${addresses.length > 1 ? 'cursor-pointer' : ''} transition-all hover:shadow-md ${isArabic ? "text-right" : "text-left"}`}
			>
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<div className="w-5 h-5 rounded-full border-2 border-emerald-600 dark:border-emerald-500 flex items-center justify-center flex-shrink-0">
								<div className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500" />
							</div>
							<span className="font-semibold text-gray-900 dark:text-gray-100">
								{isArabic ? "العنوان المحدد" : "Selected Address"}
							</span>
						</div>
						<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
							{address.formattedAddress || address.address}
						</p>
						{address.lat && address.lng && (
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
								{address.lat.toFixed(6)}, {address.lng.toFixed(6)}
							</p>
						)}
					</div>
					{addresses.length > 1 && (
						<ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform flex-shrink-0 ${showAddressList ? "rotate-180" : ""}`} />
					)}
				</div>
			</motion.div>

			{/* View on Map Button */}
			{address.lat && address.lng && (
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={onViewOnMap}
					className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-sm font-medium ${isArabic ? "flex-row-reverse" : ""}`}
				>
					<MapPin className="w-4 h-4" />
					<span>{isArabic ? "عرض على الخريطة" : "View on Map"}</span>
				</motion.button>
			)}
		</div>
	);
}

interface EmptyAddressStateProps {
	isArabic: boolean;
	onAddClick: () => void;
}

function EmptyAddressState({ isArabic, onAddClick }: EmptyAddressStateProps) {
	return (
		<div className={`text-center py-8 ${isArabic ? "text-right" : "text-left"}`}>
			<MapPin className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
			<p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
				{isArabic ? "لا توجد عناوين متاحة" : "No addresses available"}
			</p>
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={onAddClick}
				className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
			>
				{isArabic ? "إضافة عنوان جديد" : "Add New Address"}
			</motion.button>
		</div>
	);
}

interface AddressListModalProps {
	isOpen: boolean;
	addresses: Address[];
	currentSelectedId: string | null;
	isArabic: boolean;
	onClose: () => void;
	onAddressSelect: (addressId: string) => void;
	onViewOnMap: (address: Address) => void;
	onDelete: (addressId: string) => Promise<void>;
	onAddNew: () => void;
}

function AddressListModal({
	isOpen,
	addresses,
	currentSelectedId,
	isArabic,
	onClose,
	onAddressSelect,
	onViewOnMap,
	onDelete,
	onAddNew,
}: AddressListModalProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
						onClick={onClose}
					/>
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden pointer-events-auto border border-gray-200 dark:border-gray-700 ${isArabic ? "rtl" : "ltr"}`}
							dir={isArabic ? "rtl" : "ltr"}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Modal Header */}
							<div className={`p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 ${isArabic ? "flex-row-reverse" : ""}`}>
								<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{isArabic ? "اختر العنوان" : "Select Address"}
								</h3>
								<motion.button
									whileHover={{ scale: 1.1, rotate: 90 }}
									whileTap={{ scale: 0.9 }}
									onClick={onClose}
									className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400 shadow-sm"
								>
									<X className="w-5 h-5" />
								</motion.button>
							</div>

							{/* Address List */}
							<div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-3">
								{addresses.map((address, index) => {
									const isSelected = currentSelectedId?.toString() === address.id.toString();
									return (
										<AddressListItem
											key={address.id}
											address={address}
											isSelected={isSelected}
											isArabic={isArabic}
											index={index}
											canDelete={addresses.length > 1}
											onClick={() => onAddressSelect(address.id.toString())}
											onViewOnMap={() => onViewOnMap(address)}
											onDelete={() => onDelete(address.id.toString())}
										/>
									);
								})}
							</div>

							{/* Modal Footer */}
							<div className={`p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 ${isArabic ? "text-right" : "text-left"}`}>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={onAddNew}
									className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg ${isArabic ? "flex-row-reverse" : ""}`}
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
	);
}

interface AddressListItemProps {
	address: Address;
	isSelected: boolean;
	isArabic: boolean;
	index: number;
	canDelete: boolean;
	onClick: () => void;
	onViewOnMap: () => void;
	onDelete: () => void;
}

function AddressListItem({
	address,
	isSelected,
	isArabic,
	index,
	canDelete,
	onClick,
	onViewOnMap,
	onDelete,
}: AddressListItemProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
			transition={{ duration: 0.2, delay: index * 0.05 }}
			onClick={onClick}
			className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
				isSelected
					? "border-emerald-500 dark:border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 shadow-md"
					: "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 hover:shadow-sm"
			} ${isArabic ? "text-right" : "text-left"}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-3 mb-2">
						<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
							isSelected ? "border-emerald-600 dark:border-emerald-500" : "border-gray-300 dark:border-gray-600"
						}`}>
							{isSelected && (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="w-3 h-3 rounded-full bg-emerald-600 dark:bg-emerald-500"
								/>
							)}
						</div>
						<span className="font-semibold text-gray-900 dark:text-gray-100">
							{isArabic ? "العنوان" : "Address"}
						</span>
					</div>
					<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
						{address.formattedAddress || address.address}
					</p>
					{address.lat && address.lng && (
						<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
							{address.lat.toFixed(6)}, {address.lng.toFixed(6)}
						</p>
					)}
				</div>
				{isSelected && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center flex-shrink-0"
					>
						<Check className="w-4 h-4 text-white" />
					</motion.div>
				)}
			</div>

			{/* Address Actions */}
			<div className={`flex items-center gap-2 mt-3 ${isArabic ? "flex-row-reverse justify-start" : ""}`}>
				{address.lat && address.lng && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={(e) => {
							e.stopPropagation();
							onViewOnMap();
						}}
						className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
					>
						{isArabic ? "خريطة" : "Map"}
					</motion.button>
				)}
				{canDelete && (
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
						className="px-3 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors"
					>
						{isArabic ? "حذف" : "Delete"}
					</motion.button>
				)}
			</div>
		</motion.div>
	);
}
