"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/providers";
import { useAddresses, type Address } from "@/shared/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationCircle, FaMapMarkerAlt, FaPlus, FaSync, FaSpinner } from "react-icons/fa";
import Header from "./Header";
import { NotificationState } from "@/features/profile/types/profile.types";
import AddressCard from "./AddressCard";
import AddEditAddressModal from "./AddEditAddressModal";
import MapModal from "./MapModal";
import Pagination from "@/features/categories/components/category-details/Pagination";
import { InfoCard } from "../UI";
import { NotificationDialog } from "@/shared/components/feedback/NotificationDialog/NotificationDialog";
import { useRouter } from "next/navigation";

export default function AddressesPage({ initialAddressesData, initialPage, initialLimit, token }: { initialAddressesData: any, initialPage: number, initialLimit: number, token: string }) {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const router = useRouter();
	const [notification, setNotification] = useState<NotificationState>({
		message: '',
		type: 'success',
		show: false,
	});
	const {
		addresses,
		totalSize,
		currentPage,
		totalPages,
		isLoading,
		error,
		addAddress,
		updateAddress,
		deleteAddress,
		fetchAddresses,
		goToPage,
	} = useAddresses(initialPage, initialLimit, token);
	const addressesData = initialAddressesData.addresses || addresses as Address[];

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isMapModalOpen, setIsMapModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | null>(null);
	const [viewingAddress, setViewingAddress] = useState<Address | null>(null);
	const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleEditAddress = (address: Address) => {
		setEditingAddress(address);
		setIsEditModalOpen(true);
	};

	const handleDeleteAddress = useCallback((address: Address) => {
		setDeleteConfirmId(address.id);
	}, []);

	const confirmDeleteAddress = useCallback(async () => {
		if (deleteConfirmId === null) return;

		setIsDeleting(true);
		try {
			await deleteAddress(deleteConfirmId);
			setDeleteConfirmId(null);
			setNotification({
				message: isArabic ? "تم حذف العنوان بنجاح" : "Address deleted successfully",
				type: "success",
				show: true,
			});
			router.refresh();
		} catch {
			setDeleteConfirmId(null);
			setNotification({
				message: isArabic ? "فشل حذف العنوان" : "Failed to delete address",
				type: "error",
				show: true,
			});
		} finally {
			setIsDeleting(false);
		}
	}, [deleteConfirmId, deleteAddress, isArabic, router]);

	const handleAddAddress = () => {
		setIsAddModalOpen(true);
	};

	const handleViewMap = (address: Address) => {
		setViewingAddress(address);
		setIsMapModalOpen(true);
	};

	const handleSaveAddress = async (addressData: any) => {
		try {
			if (editingAddress) {
				// Edit existing address
				const result = await updateAddress(editingAddress.id, {
					address_type: addressData.address_type,
					contact_person_name: addressData.contact_person_name,
					contact_person_number: addressData.contact_person_number,
					address: addressData.address,
					latitude: addressData.latitude,
					longitude: addressData.longitude,
					zone_id: addressData.zone_id,
					road: addressData.road,
					house: addressData.house,
					floor: addressData.floor,
				});

				if (result.errors) {
					setNotification({
						message: result.errors[0].message,
						type: 'error',
						show: true,
					})
				}
				setIsEditModalOpen(false);
				setEditingAddress(null);
			} else {
				// Add new address
				const result = await addAddress({
					address_type: addressData.address_type,
					contact_person_name: addressData.contact_person_name,
					contact_person_number: addressData.contact_person_number,
					address: addressData.address,
					latitude: addressData.latitude,
					longitude: addressData.longitude,
					road: addressData.road,
					house: addressData.house,
					floor: addressData.floor,
				});
				if (result.errors) {
					setNotification({
						message: result.errors[0].message,
						type: 'error',
						show: true,
					})
				}
				setIsAddModalOpen(false);
			}
		} catch (err) {
			console.log("err", err)
			setNotification({
				message:
					err instanceof Error
						? err.message
						: isArabic
							? "فشل حفظ العنوان"
							: "Failed to save address",
				type: 'error',
				show: true,
			})
		}
		router.refresh();
	};

	const handleCloseModals = () => {
		setIsAddModalOpen(false);
		setIsEditModalOpen(false);
		setIsMapModalOpen(false);
		setEditingAddress(null);
		setViewingAddress(null);
	};

	const handleRefresh = () => {
		// fetchAddresses(currentPage);
		router.refresh();
	};



	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full overflow-x-hidden">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-between "
				>
					<div className="flex items-center gap-3 sm:gap-4">
						<div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg">
							<FaMapMarkerAlt className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
								{isArabic ? "عناويني" : "My Addresses"}
							</h2>
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
								{isArabic ? "إدارة عناوين التوصيل الخاصة بك" : "Manage your delivery addresses"}
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<button
							onClick={handleAddAddress}
							className="p-2 sm:p-2.5 rounded-xl bg-green-600 text-white shadow-lg hover:shadow-xl hover:bg-green-700 transition-all touch-manipulation active:scale-95"
							aria-label={isArabic ? "إضافة عنوان جديد" : "Add new address"}
						>
							<FaPlus className="w-5 h-5" />
						</button>
						<button
							onClick={handleRefresh}
							disabled={isLoading}
							className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 touch-manipulation active:scale-95"
							aria-label={isArabic ? "تحديث" : "Refresh"}
						>
							<FaSync
								className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? "animate-spin" : ""}`}
							/>
						</button>
					</div>
				</motion.div>

				{/* Addresses List */}
				<div className="space-y-3 sm:space-y-4 md:space-y-6 relative">
					<AnimatePresence mode="wait">
						{isLoading && addressesData.length === 0 ? (
							<motion.div
								key="loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 text-center"
							>
								<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
								<p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
									{isArabic ? "جاري التحميل..." : "Loading..."}
								</p>
							</motion.div>
						) : addressesData.length > 0 ? (
							<>
								<motion.div
									key="content"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
								>
									{addressesData.map((address: Address) => (
										<AddressCard
											key={address.id}
											address={address}
											onEdit={(address: Address) => handleEditAddress(address)}
											onDelete={(address: Address) => handleDeleteAddress(address)}
											onViewMap={(address: Address) => handleViewMap(address)}
											isArabic={isArabic}
										/>
									))}
								</motion.div>

								{/* Loading overlay for pagination */}
								{isLoading && addressesData.length > 0 && (
									<div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-xl">
										<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
									</div>
								)}
							</>
						) : (
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								<InfoCard
									title={isArabic ? "لا توجد عناوين محفوظة" : "No Saved Addresses"}
									icon={FaMapMarkerAlt}
								>
									<div className="text-center py-6 sm:py-8">
										<div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
											<FaMapMarkerAlt className="text-gray-400 dark:text-gray-500 text-2xl" />
										</div>
										<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
											{isArabic ? "لم تقم بحفظ أي عناوين بعد" : "You haven't saved any addresses yet"}
										</h3>
										<p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
											{isArabic
												? "أضف عنوانك الأول لتسهيل عملية التوصيل"
												: "Add your first address to make delivery easier"
											}
										</p>
										<button
											onClick={handleAddAddress}
											className="flex items-center justify-center gap-2 px-6 py-3 sm:py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium mx-auto touch-manipulation"
										>
											<FaPlus className="text-sm" />
											<span>{isArabic ? "إضافة عنوان جديد" : "Add New Address"}</span>
										</button>
									</div>
								</InfoCard>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Pagination */}
				{addressesData.length > 0 && totalPages > 1 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.3 }}
						className="mt-6"
					>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={goToPage}
							totalItems={totalSize}
							itemsPerPage={10}
							disabled={isLoading}
						/>
					</motion.div>
				)}

				{/* Modals */}
				<AddEditAddressModal
					isOpen={isAddModalOpen}
					onClose={handleCloseModals}
					isLoading={isLoading}
					onSave={handleSaveAddress}
				/>

				<AddEditAddressModal
					isOpen={isEditModalOpen}
					onClose={handleCloseModals}
					isLoading={isLoading}
					onSave={handleSaveAddress}
					editingAddress={editingAddress}
				/>

				<MapModal
					isOpen={isMapModalOpen}
					onClose={handleCloseModals}
					address={viewingAddress as Address}
				/>
				<NotificationDialog
					message={notification.message}
					type={notification.type}
					isVisible={notification.show}
					onClose={() => setNotification({ ...notification, show: false })}
					isArabic={isArabic}
				/>
				<NotificationDialog
					type="confirm"
					message={
						isArabic
							? "هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع عن هذا الإجراء."
							: "Are you sure you want to delete this address? This action cannot be undone."
					}
					isVisible={deleteConfirmId !== null}
					onClose={() => !isDeleting && setDeleteConfirmId(null)}
					onConfirm={confirmDeleteAddress}
					confirmLabel={isArabic ? "حذف" : "Delete"}
					cancelLabel={isArabic ? "إلغاء" : "Cancel"}
					isLoading={isDeleting}
					isArabic={isArabic}
				/>
			</div>
		</div>
	);
}