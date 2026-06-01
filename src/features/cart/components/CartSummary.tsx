'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartTotals } from '../types/cart.types';
import Link from 'next/link';

interface CartSummaryProps {
	language: 'en' | 'ar';
	totals: CartTotals;
}

export default function CartSummary({
	language,
	totals,

}: CartSummaryProps) {
	const isArabic = language === 'ar';

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4"
		>
			<h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
				<ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				{isArabic ? 'ملخص الطلب' : 'Order Summary'}
			</h3>

			<div className="space-y-3 text-sm">
				<div className="flex justify-between text-gray-600 dark:text-gray-400">
					<span>{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
					<span className="font-medium text-gray-900 dark:text-gray-100">
						{totals.subtotal.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
					</span>
				</div>


				<div className="flex justify-between text-gray-600 dark:text-gray-400">
					<span>{isArabic ? 'الضرائب والرسوم 15%' : 'Taxes and Fees 15%'}</span>

					<span className="font-medium text-gray-900 dark:text-gray-100">
						{totals.taxFee.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}

					</span>
				</div>
				<div className="flex justify-between text-gray-600 dark:text-gray-400">
					<span>{isArabic ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
					<span className="font-medium text-gray-900 dark:text-gray-100">
						{totals.deliveryFee > 0
							? `${totals.deliveryFee.toFixed(2)} ${isArabic ? 'ريال' : 'SAR'}`
							: isArabic
								? 'مجاني'
								: 'Free'}
					</span>
				</div>
				{totals.discount > 0 && (
					<div className="flex justify-between text-emerald-600 dark:text-emerald-400">
						<span>{isArabic ? 'الخصم' : 'Discount'}</span>
						<span className="font-medium">-{totals.discount.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}</span>
					</div>
				)}



				<div className="h-px bg-gray-200 dark:bg-gray-700" />

				<div className="flex justify-between text-base font-bold text-gray-900 dark:text-gray-100">
					<span>{isArabic ? 'الإجمالي' : 'Total'}</span>
					<span>
						{totals.total.toFixed(2)} {isArabic ? 'ريال' : 'SAR'}
					</span>
				</div>
			</div>

			<Link
				href={"/checkout"}
				className={`w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${isArabic ? 'flex-row-reverse' : ''
					}`}
			>
				<span>{isArabic ? 'إتمام الطلب' : 'Checkout'}</span>
				<ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
			</Link>
		</motion.div>
	);
}