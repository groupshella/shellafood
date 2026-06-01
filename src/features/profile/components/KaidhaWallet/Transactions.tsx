"use client";

import React, { useState, useMemo, useTransition, useCallback } from "react";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import useSWR from "swr";
import Pagination from "@/features/categories/components/category-details/Pagination";
import { getBaseUrl } from "@/features/(actors)/auth/constants/auth.constants";
import { getCookie } from "@/features/(actors)/auth/lib/utils/cookie.utils";

interface TransactionMetadata {
	store_name?: string;
	order_total?: number;
	delivery_charge?: number;
	discount?: number;
}

interface Transaction {
	id: number;
	transaction_id: string;
	type: "debit" | "credit" | "payment" | "refund";
	amount: number;
	balance_before: number;
	balance_after: number;
	description: string;
	order_id: number | null;
	payment_method: string;
	status: string;
	created_at: string;
	updated_at: string;
	metadata: TransactionMetadata;
}

interface TransactionsData {
	success: boolean;
	data: {
		transactions: Transaction[];
		pagination: {
			total: number;
			per_page: string;
			current_page: number;
			last_page: number;
		};
		summary: {
			total_credit: number;
			total_debit: number;
			total_spent_on_orders: number;
			total_refunds: number;
			current_balance: number;
		};
	};
}

interface TransactionsProps {
	initialTransactionsData: TransactionsData | null;
	initialPage: number;
	initialLimit: number;
	initialType: string;
}

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

export default function Transactions({
	initialTransactionsData,
	initialPage,
	initialLimit,
	initialType,
}: TransactionsProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const currentPage = Number(searchParams.get('page')) || initialPage;
	const currentLimit = Number(searchParams.get('limit')) || initialLimit;
	const currentType = searchParams.get('type') || initialType;
	const currentOffset = currentPage; // Backend uses offset as page number

	// Construct SWR key
	const baseUrl = getBaseUrl();
	const swrKey = `${baseUrl}/api/qidha-wallet/transactions?limit=${currentLimit}&offset=${currentOffset}&type=${currentType}`;

	// Use SWR for data fetching with initial data
	const { data: transactionsData, error, isLoading, mutate } = useSWR<TransactionsData>(
		swrKey,
		fetcher,
		{
			fallbackData: initialTransactionsData || undefined,
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
		}
	);

	const handlePageChange = useCallback((page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	}, [searchParams, pathname, router]);

	const handleTypeChange = useCallback((type: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('type', type);
		params.set('page', '0'); // Reset to first page when changing type
		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	}, [searchParams, pathname, router]);

	const handleRefresh = useCallback(() => {
		mutate();
	}, [mutate]);

	const formatCurrency = (amount: number) => {
		return amount.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

	const getTypeConfig = (type: string) => {
		switch (type) {
			case 'credit':
				return {
					icon: ArrowDownLeft,
					color: 'text-green-600 dark:text-green-400',
					bgColor: 'bg-green-50 dark:bg-green-900/20',
					label: 'إضافة',
				};
			case 'debit':
				return {
					icon: ArrowUpRight,
					color: 'text-red-600 dark:text-red-400',
					bgColor: 'bg-red-50 dark:bg-red-900/20',
					label: 'خصم',
				};
			case 'payment':
				return {
					icon: Receipt,
					color: 'text-blue-600 dark:text-blue-400',
					bgColor: 'bg-blue-50 dark:bg-blue-900/20',
					label: 'دفع',
				};
			case 'refund':
				return {
					icon: TrendingUp,
					color: 'text-purple-600 dark:text-purple-400',
					bgColor: 'bg-purple-50 dark:bg-purple-900/20',
					label: 'مرتجع',
				};
			default:
				return {
					icon: Wallet,
					color: 'text-gray-600 dark:text-gray-400',
					bgColor: 'bg-gray-50 dark:bg-gray-900/20',
					label: type,
				};
		}
	};

	const filterOptions = [
		{ value: 'all', label: 'الكل' },
		{ value: 'credit', label: 'إضافة' },
		{ value: 'debit', label: 'خصم' },
		{ value: 'payment', label: 'دفع' },
		{ value: 'refund', label: 'مرتجع' },
	];

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
						onClick={() => router.push('/profile/kaidha-wallet')}
						className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
					>
						العودة إلى المحفظة
					</button>
				</div>
			</div>
		);
	}

	const { transactions, pagination, summary } = transactionsData.data;
	const totalPages = pagination.last_page;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-green-900/10 to-white dark:to-gray-900 p-3 sm:p-4 md:p-6 lg:p-8" dir="rtl">
			<div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6"
				>
					<div className="flex items-center gap-3 sm:gap-4">
						<button
							onClick={() => router.push('/profile/kaidha-wallet')}
							className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all touch-manipulation"
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
								عرض جميع معاملات محفظة قيدها
							</p>
						</div>
					</div>
					<button
						onClick={handleRefresh}
						disabled={isLoading}
						className="p-2 sm:p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50 touch-manipulation"
						aria-label="تحديث"
					>
						<RefreshCw
							className={`w-5 h-5 text-gray-600 dark:text-gray-400 ${isLoading ? "animate-spin" : ""}`}
						/>
					</button>
				</motion.div>

				{/* Summary Cards */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
				>
					{/* Total Credit */}
					<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
								<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
							</div>
							<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">إجمالي الإضافات</span>
						</div>
						<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
							{formatCurrency(summary.total_credit)} <span className="text-sm font-normal text-gray-500">ريال</span>
						</p>
					</div>

					{/* Total Debit */}
					<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
								<TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
							</div>
							<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">إجمالي الخصومات</span>
						</div>
						<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
							{formatCurrency(summary.total_debit)} <span className="text-sm font-normal text-gray-500">ريال</span>
						</p>
					</div>

					{/* Total Spent on Orders */}
					<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
								<Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
							</div>
							<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">إجمالي الطلبات</span>
						</div>
						<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
							{formatCurrency(summary.total_spent_on_orders)} <span className="text-sm font-normal text-gray-500">ريال</span>
						</p>
					</div>

					{/* Current Balance */}
					<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
						<div className="flex items-center gap-2 mb-2">
							<div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
								<Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
							</div>
							<span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">الرصيد الحالي</span>
						</div>
						<p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
							{formatCurrency(summary.current_balance)} <span className="text-sm font-normal text-gray-500">ريال</span>
						</p>
					</div>
				</motion.div>

				{/* Filters */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4"
				>
					<div className="flex items-center gap-2 mb-3">
						<Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
						<span className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">تصفية حسب النوع</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{filterOptions.map((option) => (
							<button
								key={option.value}
								onClick={() => handleTypeChange(option.value)}
								className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all touch-manipulation ${currentType === option.value
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
					transition={{ duration: 0.5, delay: 0.3 }}
					className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
				>
					{isLoading || isPending ? (
						<div className="p-8 text-center">
							<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
							<p className="mt-4 text-sm text-gray-600 dark:text-gray-400">جاري التحميل...</p>
						</div>
					) : transactions.length === 0 ? (
						<div className="p-8 text-center">
							<AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
							<p className="text-gray-600 dark:text-gray-400">لا توجد معاملات</p>
						</div>
					) : (
						<div className="divide-y divide-gray-200 dark:divide-gray-700">
							{transactions.map((transaction) => {
								const typeConfig = getTypeConfig(transaction.type);
								const TypeIcon = typeConfig.icon;

								return (
									<motion.div
										key={transaction.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex items-start gap-3 flex-1">
												<div className={`p-2.5 ${typeConfig.bgColor} rounded-xl flex-shrink-0`}>
													<TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100">
															{typeConfig.label}
														</h3>
														<span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${transaction.status === 'completed'
																? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
																: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
															}`}>
															{transaction.status === 'completed' ? 'مكتمل' : transaction.status}
														</span>
													</div>
													<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
														{transaction.description}
													</p>
													{transaction.metadata?.store_name && (
														<p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
															المتجر: {transaction.metadata.store_name}
														</p>
													)}
													{transaction.order_id && (
														<p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
															رقم الطلب: #{transaction.order_id}
														</p>
													)}
													<div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
														<Calendar className="w-3 h-3" />
														<span>{formatDate(transaction.created_at)}</span>
													</div>
												</div>
											</div>
											<div className="text-left flex-shrink-0">
												<p className={`text-lg sm:text-xl font-bold ${transaction.type === 'credit' || transaction.type === 'refund'
														? 'text-green-600 dark:text-green-400'
														: 'text-red-600 dark:text-red-400'
													}`}>
													{transaction.type === 'credit' || transaction.type === 'refund' ? '+' : '-'}
													{formatCurrency(transaction.amount)} ريال
												</p>
												<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
													الرصيد بعد: {formatCurrency(transaction.balance_after)}
												</p>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					)}
				</motion.div>

				{/* Pagination */}
				{transactions.length > 0 && totalPages > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
						totalItems={pagination.total}
						itemsPerPage={currentLimit}
						disabled={isLoading || isPending}
					/>
				)}
			</div>
		</div>
	);
}

