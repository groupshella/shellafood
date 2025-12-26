"use client";

import { useState } from "react";
import { useLanguage } from "@/providers";
import Header from "./Header";
import { InfoCard, InfoField, SecurityAction } from "../UI";
import { FaUser, FaShieldAlt, FaLock, FaIdCard, FaTrash } from "react-icons/fa";
interface PersonalInfo {
		id: number;
		f_name: string;
		l_name: string;
		fullName: string;
		email: string;
		phone: string;
		image: string;
		wallet_balance: number;
		loyalty_point: number;
		order_count: number;
	}
export default function AccountInfoPage({personalInfo}: {personalInfo: PersonalInfo}) {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';
	const [isEditing, setIsEditing] = useState(false);
	
	

	// State for form data
	const [formData, setFormData] = useState(personalInfo);

	const handleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = () => {
		// Handle save logic here - you can add API call to save the data
		console.log('Saving data:', formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		// Reset form data to original values
		setFormData(personalInfo);
		setIsEditing(false);
	};

	const handleFieldChange = (field: string, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
			// Update fullName when f_name or l_name changes
			...(field === 'f_name' || field === 'l_name' ? {
				fullName: field === 'f_name' 
					? `${value} ${prev.l_name || ''}`.trim()
					: `${prev.f_name || ''} ${value}`.trim()
			} : {})
		}));
	};


	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={direction}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
				{/* Header */}
				<div className="mb-8">
					<Header 
						onEdit={handleEdit}
						onSettings={() => console.log('Settings clicked')}
					/>
				</div>

				{/* Personal Information */}
				<div className="mb-8">
					<InfoCard 
						title={isArabic ? "المعلومات الشخصية" : "Personal Information"}
						icon={FaUser}
					>
						<div className="space-y-4">
							{/* First Name */}
							<InfoField
								label={isArabic ? "الاسم الأول" : "First Name"}
								value={formData.f_name}
								editable={isEditing}
								onChange={(value) => handleFieldChange('f_name', value)}
							/>
							{/* Last Name */}
							<InfoField
								label={isArabic ? "اسم العائلة" : "Last Name"}
								value={formData.l_name}
								editable={isEditing}
								onChange={(value) => handleFieldChange('l_name', value)}
							/>
							{/* Email */}
							{formData.email && (
								<InfoField
									label={isArabic ? "البريد الإلكتروني" : "Email Address"}
									value={formData.email}
									type="email"
									editable={isEditing}
									onChange={(value) => handleFieldChange('email', value)}
								/>
							)}
							{/* Phone */}
							{formData.phone && (
								<InfoField
									label={isArabic ? "رقم الهاتف" : "Phone Number"}
									value={formData.phone}
									type="tel"
									editable={isEditing}
									onChange={(value) => handleFieldChange('phone', value)}
								/>
							)}
							{/* <InfoField
								label={isArabic ? "تاريخ الميلاد" : "Date of Birth"}
								value={formData.dateOfBirth}
								type="date"
								editable={isEditing}
								onChange={(value) => handleFieldChange('dateOfBirth', value)}
							/> */}
							{/* <InfoField
								label={isArabic ? "رقم الهوية" : "National ID"}
								value={formData.nationalId}
								editable={false}
							/> */}
							{/* <InfoField
								label={isArabic ? "العنوان" : "Address"}
								value={formData.address}
								editable={isEditing}
								onChange={(value) => handleFieldChange('address', value)}
							/> */}
						</div>
					</InfoCard>
				</div>

				{/* Account Statistics */}
				<div className="mb-8">
					<InfoCard 
						title={isArabic ? "إحصائيات الحساب" : "Account Statistics"}
						icon={FaUser}
					>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{/* Wallet Balance */}
							<div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
								<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
									{isArabic ? "رصيد المحفظة" : "Wallet Balance"}
								</div>
								<div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
									{formData.wallet_balance.toFixed(2)} {isArabic ? "ريال" : "SAR"}
								</div>
							</div>
							{/* Loyalty Points */}
							<div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
								<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
									{isArabic ? "نقاط الولاء" : "Loyalty Points"}
								</div>
								<div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
									{formData.loyalty_point.toLocaleString()}
								</div>
							</div>
							{/* Order Count */}
							<div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
								<div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
									{isArabic ? "عدد الطلبات" : "Total Orders"}
								</div>
								<div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
									{formData.order_count}
								</div>
							</div>
						</div>
					</InfoCard>
				</div>

				{/* Edit Actions */}
				{isEditing && (
					<div className="mb-8">
						<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
							<div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 bg-green-500 rounded-full"></div>
									<span className="text-sm font-medium text-green-700 dark:text-green-400">
										{isArabic ? "وضع التعديل نشط" : "Edit mode is active"}
									</span>
								</div>
								<div className={`flex gap-3 ${isArabic ? 'flex-row-reverse' : 'flex-row'}`}>
									<button
										onClick={handleCancel}
										className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
									>
										{isArabic ? "إلغاء" : "Cancel"}
									</button>
									<button
										onClick={handleSave}
										className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
									>
										{isArabic ? "حفظ" : "Save"}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Security Actions */}
				<div className="mt-8">
					<InfoCard 
						title={isArabic ? "إجراءات الأمان" : "Security Actions"}
						icon={FaShieldAlt}
					>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<SecurityAction
								icon={FaLock}
								title={isArabic ? "تغيير كلمة المرور" : "Change Password"}
								subtitle={isArabic ? "آخر تحديث: منذ شهر" : "Last updated: 1 month ago"}
								onClick={() => console.log('Change password clicked')}
							/>
							<SecurityAction
								icon={FaIdCard}
								title={isArabic ? "التحقق من الهوية" : "Identity Verification"}
								subtitle={isArabic ? "متحقق" : "Verified"}
								onClick={() => console.log('Identity verification clicked')}
							/>
							<SecurityAction
								icon={FaTrash}
								title={isArabic ? "حذف الحساب" : "Delete Account"}
								subtitle={isArabic ? "إجراء نهائي لا يمكن التراجع عنه" : "Permanent action, cannot be undone"}
								onClick={() => console.log('Delete account clicked')}
								isDanger={true}
							/>
						</div>
					</InfoCard>
				</div>
			</div>
		</div>
	);
}
