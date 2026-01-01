"use client";

import React, { useState } from "react";
import {
	Wallet,
	RefreshCw,
	CreditCard,
	ArrowUpRight,
	TrendingUp,
	Shield,
	AlertCircle,
	Lock,
	CheckCircle2,
	Clock,
	FileText,
	Receipt,
	ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ContractModal } from "@/features/investor";
import { BASE_URL, getBaseUrl } from "@/features/auth/constants/auth.constants";

interface PersonalInfo {
	first_name: string;
	father_name: string;
	grandfather_name: string;
	last_name: string;
	national_id: string;
	mobile: string;
}

interface IncomeSource {
	source_of_income: string;
	monthly_amount: string;
	salary_day: number | null;
}

interface WalletData {
	id: number;
	user_id: number;
	status: string;
	credit_limit: number;
	available_balance: number;
	used_balance: number;
	minimum_due: number;
	usage_percentage_limit: number;
	purchase_limit: number;
	used_percentage: number;
	total_available_balance: number;
	minimum_due_limit: number;
	lock_day: string;
	signature_status: boolean;
	signature_path: string;
	salary_day: number | null;
	created_at: string;
	updated_at: string;
	personal_info: PersonalInfo;
	income_source: IncomeSource;
}

interface KaidhaWalletProps {
	walletData: {
		success: boolean;
		data: WalletData;
	} | null;
}

export default function KaidhaWallet({ walletData }: KaidhaWalletProps) {
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [showContractModal, setShowContractModal] = useState(false);
	const router = useRouter();
	const baseUrl = getBaseUrl();
	// If no wallet data, show error state
	if (!walletData || !walletData.success || !walletData.data) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-red-50/20 dark:via-red-900/10 to-white dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center" dir="rtl">
				<div className="text-center">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						لا توجد بيانات محفظة
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						عذراً، لم نتمكن من تحميل بيانات محفظة قيدها
					</p>
					<button
						onClick={() => router.refresh()}
						className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
					>
						إعادة المحاولة
					</button>
				</div>
			</div>
		);
	}

	const wallet = walletData.data;

	// Parse numeric values
	const totalBalance = wallet.total_available_balance || 0;
	const creditLimit = wallet.credit_limit || 0;
	const availableBalance = wallet.available_balance || 0;
	const usedBalance = wallet.used_balance || 0;
	const usedPercentage = wallet.used_percentage || 0;
	const purchaseLimit = wallet.purchase_limit || 0;

	const handleRefresh = async () => {
		setIsRefreshing(true);
		router.refresh();
		// Wait for refresh
		setTimeout(() => {
			setIsRefreshing(false);
		}, 1000);
	};

	const formatCurrency = (amount: number) => {
		return amount.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString("ar-SA", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getStatusConfig = (status: string) => {
		switch (status.toLowerCase()) {
			case 'active':
				return {
					color: 'bg-green-400',
					text: 'نشط',
					bgColor: 'bg-green-50 dark:bg-green-900/20',
					textColor: 'text-green-700 dark:text-green-400',
					icon: CheckCircle2,
				};
			case 'locked':
				return {
					color: 'bg-red-400',
					text: 'مقفل',
					bgColor: 'bg-red-50 dark:bg-red-900/20',
					textColor: 'text-red-700 dark:text-red-400',
					icon: Lock,
				};
			case 'pending':
				return {
					color: 'bg-yellow-400',
					text: 'قيد المراجعة',
					bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
					textColor: 'text-yellow-700 dark:text-yellow-400',
					icon: Clock,
				};
			default:
				return {
					color: 'bg-gray-400',
					text: status,
					bgColor: 'bg-gray-50 dark:bg-gray-800',
					textColor: 'text-gray-700 dark:text-gray-400',
					icon: AlertCircle,
				};
		}
	};

	const getSignatureStatus = (status: boolean) => {
		return status 
			? { text: 'تم التوقيع', color: 'text-green-600 dark:text-green-400', icon: CheckCircle2 }
			: { text: 'لم يتم التوقيع', color: 'text-yellow-600 dark:text-yellow-400', icon: Clock };
	};

	const statusConfig = getStatusConfig(wallet.status);
	const StatusIcon = statusConfig.icon;
	const signatureStatus = getSignatureStatus(wallet.signature_status);
	const SignatureIcon = signatureStatus.icon;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-green-900/10 to-white dark:to-gray-900 p-3 sm:p-4 md:p-6 lg:p-8" dir="rtl">
			<div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex  flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6"
				>
					<div className="flex items-center gap-3 sm:gap-4">
						<div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg">
							<Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">محفظة قيدها</h2>
							{wallet.id && (
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
									رقم المحفظة: {wallet.id}
								</p>
							)}
						</div>
					</div>
					<button
						onClick={handleRefresh}
						disabled={isRefreshing}
						className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 touch-manipulation"
						aria-label="تحديث الرصيد"
					>
						<RefreshCw
							className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isRefreshing ? "animate-spin" : ""}`}
						/>
					</button>
				</motion.div>

				{/* Status Card - Must Show */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className={`${statusConfig.bgColor} rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6`}
				>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className={`p-2 sm:p-2.5 rounded-lg ${statusConfig.bgColor} border-2 border-current`}>
								<StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${statusConfig.textColor}`} />
							</div>
							<div>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">حالة المحفظة</p>
								<p className={`text-base sm:text-lg font-bold ${statusConfig.textColor}`}>
									{statusConfig.text}
								</p>
							</div>
						</div>
						<div className={`w-3 h-3 ${statusConfig.color} rounded-full shadow-lg`}></div>
					</div>
				</motion.div>

				{/* Main Balance Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.15 }}
					className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-4 sm:p-6 md:p-8 text-white"
				>
					{/* Decorative Pattern */}
					<div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
					<div className="absolute bottom-0 left-0 w-36 sm:w-48 h-36 sm:h-48 bg-white/10 rounded-full -ml-18 sm:-ml-24 -mb-18 sm:-mb-24"></div>

					<div className="relative z-10">
						{/* Total Available Balance - Must Show */}
						<div className="mb-4 sm:mb-6">
							<p className="text-xs sm:text-sm font-medium opacity-80 mb-2">الرصيد المتاح الكلي</p>
							<h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2">
								{formatCurrency(totalBalance)} ريال
							</h3>
							<p className="text-xs sm:text-sm opacity-75">
								المتاح الآن: {formatCurrency(availableBalance)} ريال
							</p>
						</div>

						{/* Payment Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className="w-full sm:w-auto bg-white text-emerald-600 rounded-full px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 touch-manipulation"
						>
							<ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
							الدفع الآن
						</motion.button>
					</div>
				</motion.div>

				{/* Usage Percentage Progress - Must Show */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8"
				>
					<div className="flex items-center justify-between mb-3 sm:mb-4">
						<div className="flex items-center gap-2">
							<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
							<span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
								نسبة الاستخدام
							</span>
						</div>
						<span className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
							{usedPercentage.toFixed(1)}%
						</span>
					</div>
					<div className="relative h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${Math.min(usedPercentage, 100)}%` }}
							transition={{ duration: 1, ease: "easeOut" }}
							className={`absolute top-0 right-0 h-full rounded-full ${
								usedPercentage >= 90 
									? 'bg-gradient-to-l from-red-500 to-red-600'
									: usedPercentage >= 75
									? 'bg-gradient-to-l from-yellow-500 to-yellow-600'
									: 'bg-gradient-to-l from-green-500 to-emerald-600'
							}`}
						></motion.div>
					</div>
					<p className="text-xs text-gray-500 dark:text-gray-400 text-center">
						{usedPercentage >= 90 
							? '⚠️ استهلاك عالي - يرجى مراجعة استخدامك'
							: usedPercentage >= 75
							? '⚡ قريب من الحد الأقصى'
							: '✅ استخدام طبيعي'
						}
					</p>
				</motion.div>

				{/* Key Metrics - Single Card Container - Must Show */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6"
				>
					{/* Header */}
					<div className="mb-4 sm:mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
						<h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
							معلومات المحفظة
						</h3>
					</div>

					{/* Metrics Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
						{/* Credit Limit - Must Show */}
						<div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							<div className="flex items-center gap-2 sm:gap-3">
								<div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex-shrink-0">
									<CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
								</div>
								<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">الحد الائتماني</span>
							</div>
							<p className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
								{formatCurrency(creditLimit)} <span className="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">ريال</span>
							</p>
						</div>

						{/* Used Balance - Must Show */}
						<div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							<div className="flex items-center gap-2 sm:gap-3">
								<div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg flex-shrink-0">
									<ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
								</div>
								<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">الرصيد المستخدم</span>
							</div>
							<p className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
								{formatCurrency(usedBalance)} <span className="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">ريال</span>
							</p>
						</div>

						{/* Available Balance - Must Show */}
						<div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							<div className="flex items-center gap-2 sm:gap-3">
								<div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg flex-shrink-0">
									<Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
								</div>
								<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">الرصيد المتاح</span>
							</div>
							<p className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
								{formatCurrency(availableBalance)} <span className="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">ريال</span>
							</p>
						</div>

						{/* Purchase Limit - Must Show */}
						<div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
							<div className="flex items-center gap-2 sm:gap-3">
								<div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex-shrink-0">
									<Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
								</div>
								<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">حد الشراء</span>
							</div>
							<p className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
								{formatCurrency(purchaseLimit)} <span className="text-sm sm:text-base font-normal text-gray-500 dark:text-gray-400">ريال</span>
							</p>
						</div>
					</div>
				</motion.div>

				{/* Lock Date - Must Show (if exists) */}
				{wallet.lock_day && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.35 }}
						className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6"
					>
						<div className="flex items-center gap-3">
							<div className="p-2.5 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
								<Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
							</div>
							<div>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ القفل</p>
								<p className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
									{formatDate(wallet.lock_day)}
								</p>
							</div>
						</div>
					</motion.div>
				)}

				{/* Optional: Contract Signed Status */}
				{wallet.signature_path && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6"
					>
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-3 flex-1">
								<div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
									<SignatureIcon className={`w-5 h-5 ${signatureStatus.color}`} />
								</div>
								<div>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">حالة التوقيع</p>
									<p className={`text-base sm:text-lg font-bold ${signatureStatus.color}`}>
										{signatureStatus.text}
									</p>
								</div>
							</div>
							{/* View Contract Button - Only show if signed and has signature_path */}
							{wallet.signature_status && wallet.signature_path && (
								<button
									onClick={() => setShowContractModal(true)}
									className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all hover:shadow-lg active:scale-95 touch-manipulation whitespace-nowrap"
									aria-label="عرض العقد"
								>
									<FileText className="w-4 h-4 sm:w-5 sm:h-5" />
									<span className="hidden sm:inline">عرض العقد</span>
									<span className="sm:hidden">عرض</span>
								</button>
							)}
						</div>
					</motion.div>
				)}

				{/* Optional: Income Source Info */}
				{wallet.income_source && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.45 }}
						className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8"
					>
						<h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">معلومات الدخل</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
							<div>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">مصدر الدخل</p>
								<p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
									{wallet.income_source.source_of_income === 'private_sector' ? 'القطاع الخاص' : wallet.income_source.source_of_income}
								</p>
							</div>
							<div>
								<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">الدخل الشهري</p>
								<p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
									{formatCurrency(parseFloat(wallet.income_source.monthly_amount))} ريال
								</p>
							</div>
							{wallet.income_source.salary_day && (
								<div>
									<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">يوم استلام الراتب</p>
									<p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
										اليوم {wallet.income_source.salary_day} من كل شهر
									</p>
								</div>
							)}
						</div>
					</motion.div>
				)}

				{/* View Transactions Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="pt-4 sm:pt-6"
				>
					<button
						onClick={() => router.push('/profile/kaidha-wallet/transactions')}
						className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] touch-manipulation"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3 sm:gap-4">
								<div className="p-2.5 sm:p-3 bg-white/20 rounded-xl">
									<Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
								</div>
								<div className="text-right">
									<h3 className="text-base sm:text-lg font-bold mb-1">عرض سجل المعاملات</h3>
									<p className="text-xs sm:text-sm text-white/90">تتبع جميع عمليات الخصم والإضافة</p>
								</div>
							</div>
							<ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
						</div>
					</button>
				</motion.div>

				{/* Contract Modal */}
				{wallet.signature_status && wallet.signature_path && (
					<ContractModal
						isOpen={showContractModal}
						onClose={() => setShowContractModal(false)}
						fileUrl={`${BASE_URL}/storage/${wallet.signature_path}`}
					/>
				)}
			</div>
		</div>
	);
}

