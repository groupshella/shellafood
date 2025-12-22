"use client";

import { useLanguage } from "@/providers";
import { FaUser, FaEdit, FaCog } from "react-icons/fa";

interface HeaderProps {
	onEdit?: () => void;
	onSettings?: () => void;
}

export default function Header({ onEdit, onSettings }: HeaderProps) {
	const { language, t } = useLanguage();
	const isArabic = language === 'ar';
	const direction = isArabic ? 'rtl' : 'ltr';

	return (
		<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8" dir={direction}>
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				{/* Title Section */}
				<div className="flex items-center gap-4">
					<div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
						<FaUser className="text-green-600 dark:text-green-400 text-xl" />
					</div>
					<div>
						<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
							{t("profile.dashboard.accountInfo")}
						</h1>
						<p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base mt-1">
							{isArabic 
								? "إدارة معلوماتك الشخصية وإعدادات الحساب" 
								: "Manage your personal information and account settings"
							}
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className={`flex gap-3 ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
					{onEdit && (
						<button
							onClick={onEdit}
							className="flex items-center gap-2 px-4 py-2.5 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium text-sm"
						>
							<FaEdit className="text-sm" />
							<span>{isArabic ? "تعديل" : "Edit"}</span>
						</button>
					)}
					{onSettings && (
						<button
							onClick={onSettings}
							className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
						>
							<FaCog className="text-sm" />
							<span>{isArabic ? "الإعدادات" : "Settings"}</span>
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
