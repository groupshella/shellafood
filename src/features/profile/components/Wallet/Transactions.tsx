"use client";

import React, { useState, useMemo, useTransition, useCallback, memo } from "react";
import {
	ArrowDownLeft,
	ArrowUpRight,
	RefreshCw,
	AlertCircle,
	Receipt,
	Calendar,
	TrendingDown,
	TrendingUp,
	Wallet,
	Filter,
	ArrowLeft,
	ShoppingCart,
	Coins,
	Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
import Pagination from "@/features/categories/components/category-details/Pagination";
import { getBaseUrl } from "@/features/(actors)/auth/constants/auth.constants";
import { getCookie } from "@/features/(actors)/auth/lib/utils/cookie.utils";

interface WalletTransaction {
	id: number;
	user_id: number;
	transaction_id: string;
	credit: string;
	debit: string;
	admin_bonus: string;
	balance: string;
	transaction_type: string;
	reference: string;
	created_at: string;
	updated_at: string;
}

interface WalletTransactionsData {
	total_size: number;
	limit: number;
	offset: number;
	data: WalletTransaction[];
}

interface WalletTransactionsProps {
	initialTransactionsData: WalletTransactionsData | null;
	initialPage: number;
	initialLimit: number;
	initialType: string;
}

// ============================================================================
// CONSTANTS - Moved outside component for better performance
// ============================================================================
const FILTER_OPTIONS = [
	{ value: 'all', label: 'الكل' },
	{ value: 'order', label: 'طلبات' },
	{ value: 'loyalty_point', label: 'نقاط الولاء' },
	{ value: 'add_fund', label: 'إضافة رصيد' },
	{ value: 'referrer', label: 'إحالة' },
	{ value: 'CashBack', label: 'استرجاع نقدي' },
] as const;

const TRANSACTION_TYPE_CONFIG = {
	order: {
		icon: ShoppingCart,
		color: 'text-blue-600 dark:text-blue-400',
		bgColor: 'bg-blue-50 dark:bg-blue-900/20',
		label: 'طلب',
	},
	loyalty_point: {
		icon: Coins,
		color: 'text-yellow-600 dark:text-yellow-400',
		bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
		label: 'نقاط الولاء',
	},
	add_fund: {
		icon: ArrowDownLeft,
		color: 'text-green-600 dark:text-green-400',
		bgColor: 'bg-green-50 dark:bg-green-900/20',
		label: 'إضافة رصيد',
	},
	referrer: {
		icon: Gift,
		color: 'text-purple-600 dark:text-purple-400',
		bgColor: 'bg-purple-50 dark:bg-purple-900/20',
		label: 'إحالة',
	},
	CashBack: {
		icon: TrendingUp,
		color: 'text-emerald-600 dark:text-emerald-400',
		bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
		label: 'استرجاع نقدي',
	},
	peer_transfer_sent: {
		icon: ArrowUpRight,
		color: 'text-red-600 dark:text-red-400',
		bgColor: 'bg-red-50 dark:bg-red-900/20',
		label: 'تحويل مرسل',
	},
	peer_transfer_received: {
		icon: ArrowDownLeft,
		color: 'text-green-600 dark:text-green-400',
		bgColor: 'bg-green-50 dark:bg-green-900/20',
		label: 'تحويل مستلم',
	},
} as const;

const DEFAULT_TYPE_CONFIG = {
	icon: Wallet,
	color: 'text-gray-600 dark:text-gray-400',
	bgColor: 'bg-gray-50 dark:bg-gray-900/20',
	label: '',
};

// ============================================================================
// UTILITY FUNCTIONS - Memoized outside component
// ============================================================================
const formatCurrency = (amount: string | number) => {
	const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
	return numAmount.toLocaleString("ar-SA", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("ar-SA", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

// ============================================================================
// MEMOIZED TRANSACTION ITEM COMPONENT
// ============================================================================
const TransactionItem = memo(({ transaction }: { transaction: WalletTransaction }) => {
	const typeConfig = TRANSACTION_TYPE_CONFIG[transaction.transaction_type as keyof typeof TRANSACTION_TYPE_CONFIG] || {
		...DEFAULT_TYPE_CONFIG,
		label: transaction.transaction_type,
	};

	const TypeIcon = typeConfig.icon;
	const credit = parseFloat(transaction.credit || '0');
	const debit = parseFloat(transaction.debit || '0');
	const amount = credit > 0 ? credit : debit;
	const isCredit = credit > 0;

	return (
		<div className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
			<div className="flex items-start justify-between gap-4">
				<div className="flex items-start gap-3 flex-1">
					<div className={`p-2.5 ${typeConfig.bgColor} rounded-xl flex-shrink-0`}>
						<TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
					</div>
					<div className="flex-1 min-w-0">
						<h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
							{typeConfig.label}
						</h3>
						<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
							{transaction.reference || transaction.transaction_type}
						</p>
						<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
							<Calendar className="w-3 h-3 flex-shrink-0" />
							<span>{formatDate(transaction.created_at)}</span>
						</div>
						<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
							رقم المعاملة: {transaction.transaction_id.substring(0, 8)}...
						</p>
					</div>
				</div>
				<div className="text-left flex-shrink-0">
					<p className={`text-lg sm:text-xl font-bold ${isCredit
							? 'text-green-600 dark:text-green-400'
							: 'text-red-600 dark:text-red-400'
						}`}>
						{isCredit ? '+' : '-'}
						{formatCurrency(amount)} ريال
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
						الرصيد: {formatCurrency(transaction.balance)} ريال
					</p>
				</div>
			</div>
		</div>
	);
});

TransactionItem.displayName = 'TransactionItem';

// ============================================================================
// FETCHER FUNCTION
// ============================================================================
const fetcher = async (url: string) => {
	const token = getCookie('auth_token');
	if (!token) throw new Error('No authentication token');

	const response = await fetch(url, {
		headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch transactions');
	}

	return response.json();
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function WalletTransactions({
	initialTransactionsData,
	initialPage,
	initialLimit,
	initialType,
}: WalletTransactionsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();
	const baseUrl = getBaseUrl();
	// FIX: Backend sends offset as page number (offset 1 = page 1)
	const currentPage = Number(searchParams.get('page')) || initialPage;
	const currentLimit = Number(searchParams.get('limit')) || initialLimit;
	const currentType = searchParams.get('type') || initialType;
	const currentOffset = currentPage; // Backend expects offset = page number

	// Construct SWR key
	const swrKey = `${baseUrl}/api/v1/customer/wallet/transactions?limit=${currentLimit}&offset=${currentOffset}&type=${currentType}`;

	// Use SWR with performance optimizations
	const { data: transactionsData, error, isLoading, mutate } = useSWR<WalletTransactionsData>(
		swrKey,
		fetcher,
		{
			fallbackData: initialTransactionsData || undefined,
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			keepPreviousData: true, // Prevents flash of loading state
			dedupingInterval: 5000, // Dedupe requests within 5 seconds
		}
	);

	// Optimized page change handler with instant UI feedback
	const handlePageChange = useCallback((page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());

		// Smooth scroll to top immediately for better UX
		window.scrollTo({ top: 0, behavior: 'smooth' });

		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	}, [searchParams, pathname, router]);

	// Optimized type change handler
	const handleTypeChange = useCallback((type: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('type', type);
		params.set('page', '1'); // Reset to first page

		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	}, [searchParams, pathname, router]);

	// Optimized refresh handler
	const handleRefresh = useCallback(() => {
		mutate();
	}, [mutate]);

	// Error/No data state
	if (!transactionsData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-red-50/20 dark:via-red-900/10 to-white dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center" dir="rtl">
				<div className="text-center">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
						لا توجد بيانات معاملات
					</h2>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						عذراً، لم نتمكن من تحميل سجل المعاملات
					</p>
					<button
						onClick={() => router.push('/profile/wallet')}
						className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors touch-manipulation"
					>
						العودة إلى المحفظة
					</button>
				</div>
			</div>
		);
	}

	const transactions = transactionsData.data || [];
	const totalPages = Math.ceil(transactionsData.total_size / currentLimit);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-green-900/10 to-white dark:to-gray-900 p-3 sm:p-4 md:p-6 lg:p-8" dir="rtl">
			<div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="flex flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6"
				>
					<div className="flex items-center gap-3 sm:gap-4">
						<button
							onClick={() => router.push('/profile/wallet')}
							className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all touch-manipulation active:scale-95"
							aria-label="العودة إلى المحفظة"
						>
							<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						</button>
						<div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg">
							<Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
						</div>
						<div>
							<h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">سجل المعاملات</h2>
							<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
								عرض جميع معاملات محفظتك
							</p>
						</div>
					</div>
					<button
						onClick={handleRefresh}
						disabled={isLoading}
						className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 touch-manipulation active:scale-95"
						aria-label="تحديث"
					>
						<RefreshCw
							className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? "animate-spin" : ""}`}
						/>
					</button>
				</motion.div>

				{/* Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
					className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4"
				>
					<div className="flex items-center gap-2 mb-3">
						<Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
						<span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">تصفية حسب النوع</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{FILTER_OPTIONS.map((option) => (
							<button
								key={option.value}
								onClick={() => handleTypeChange(option.value)}
								disabled={isPending}
								className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all touch-manipulation active:scale-95 disabled:opacity-50 ${currentType === option.value
										? 'bg-green-600 text-white shadow-lg'
										: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
									}`}
							>
								{option.label}
							</button>
						))}
					</div>
				</motion.div>

				{/* Transactions List */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.2 }}
					className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative"
				>
					<AnimatePresence mode="wait">
						{isLoading && !transactionsData ? (
							<motion.div
								key="loading"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="p-8 text-center"
							>
								<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
								<p className="mt-4 text-sm text-gray-600 dark:text-gray-400">جاري التحميل...</p>
							</motion.div>
						) : transactions.length === 0 ? (
							<motion.div
								key="empty"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="p-8 text-center"
							>
								<AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
								<p className="text-gray-600 dark:text-gray-400">لا توجد معاملات</p>
							</motion.div>
						) : (
							<motion.div
								key="content"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="divide-y divide-gray-200 dark:divide-gray-700"
							>
								{transactions.map((transaction) => (
									<TransactionItem
										key={transaction.id}
										transaction={transaction}
									/>
								))}
							</motion.div>
						)}
					</AnimatePresence>

					{/* Loading overlay for pagination changes */}
					{isPending && transactions.length > 0 && (
						<div className="absolute inset-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-xl sm:rounded-2xl">
							<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
						</div>
					)}
				</motion.div>

				{/* Pagination */}
				{transactions.length > 0 && totalPages > 1 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3, delay: 0.3 }}
					>
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							totalItems={transactionsData.total_size}
							itemsPerPage={currentLimit}
							disabled={isPending}
						/>
					</motion.div>
				)}
			</div>
		</div>
	);
}