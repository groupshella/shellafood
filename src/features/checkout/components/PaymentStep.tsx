'use client';

import { ChevronLeft, Tag, FileText, Heart } from 'lucide-react';
import type { PaymentMethod, DeliveryInfo } from '../types/checkout.types';
import { PAYMENT_LABELS, formatPrice } from '../utils/checkout.utils';

interface PaymentStepProps {
	paymentMethod: PaymentMethod | null;
	deliveryInfo: DeliveryInfo | null;
	orderAmount: number;
	dmTips: number;
	orderNote: string;
	couponCode: string;
	onPaymentMethodChange: (m: PaymentMethod) => void;
	onDmTipsChange: (t: number) => void;
	onOrderNoteChange: (n: string) => void;
	onCouponChange: (c: string) => void;
	onNext: () => void;
}

const TIP_OPTIONS = [0, 2, 5, 10];

const AVAILABLE_METHODS: PaymentMethod[] = [
	'cash_on_delivery',
	'wallet_qidha',
	'digital_payment',
];

export function PaymentStep({
	paymentMethod,
	deliveryInfo,
	orderAmount,
	dmTips,
	orderNote,
	couponCode,
	onPaymentMethodChange,
	onDmTipsChange,
	onOrderNoteChange,
	onCouponChange,
	onNext,
}: PaymentStepProps) {
	return (
		<div className="space-y-4">
			{/* Payment methods */}
			<div className="bg-white rounded-3xl p-4 shadow-sm">
				<p className="text-sm font-bold text-gray-800 mb-3 text-right">
					طريقة الدفع
				</p>
				<div className="space-y-2">
					{AVAILABLE_METHODS.map((method) => {
						const info = PAYMENT_LABELS[method];
						const selected = paymentMethod === method;
						return (
							<button
								key={method}
								onClick={() => onPaymentMethodChange(method)}
								className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 ${
									selected
										? 'border-emerald-400 bg-emerald-50'
										: 'border-gray-100 bg-gray-50 hover:border-gray-200'
								}`}
							>
								<div
									className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
										selected ? 'border-emerald-500' : 'border-gray-300'
									}`}
								>
									{selected && (
										<div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
									)}
								</div>
								<div className="flex items-center gap-2 text-right">
									<span className="text-sm font-semibold text-gray-700">
										{info.ar}
									</span>
									<span className="text-lg">{info.icon}</span>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Delivery tips */}
			<div className="bg-white rounded-3xl p-4 shadow-sm">
				<div className="flex items-center justify-end gap-2 mb-3">
					<p className="text-sm font-bold text-gray-800">إكرامية السائق</p>
					<Heart size={16} className="text-pink-400" />
				</div>
				<div className="grid grid-cols-4 gap-2">
					{TIP_OPTIONS.map((tip) => (
						<button
							key={tip}
							onClick={() => onDmTipsChange(tip)}
							className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
								dmTips === tip
									? 'bg-emerald-500 text-white shadow-sm'
									: 'bg-gray-50 text-gray-500 hover:bg-gray-100'
							}`}
						>
							{tip === 0 ? 'بدون' : `${tip} ر.س`}
						</button>
					))}
				</div>
			</div>

			{/* Coupon */}
			<div className="bg-white rounded-3xl p-4 shadow-sm">
				<div className="flex items-center justify-end gap-2 mb-2">
					<p className="text-sm font-bold text-gray-800">كود الخصم</p>
					<Tag size={16} className="text-amber-400" />
				</div>
				<div className="flex gap-2">
					<button className="px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold shrink-0">
						تطبيق
					</button>
					<input
						type="text"
						value={couponCode}
						onChange={(e) => onCouponChange(e.target.value)}
						placeholder="أدخل كود الخصم..."
						dir="rtl"
						className="flex-1 px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-right placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
					/>
				</div>
			</div>

			{/* Order note */}
			<div className="bg-white rounded-3xl p-4 shadow-sm">
				<div className="flex items-center justify-end gap-2 mb-2">
					<p className="text-sm font-bold text-gray-800">ملاحظات الطلب</p>
					<FileText size={16} className="text-blue-400" />
				</div>
				<textarea
					value={orderNote}
					onChange={(e) => onOrderNoteChange(e.target.value)}
					placeholder="أي طلبات خاصة للمطعم..."
					dir="rtl"
					rows={3}
					className="w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-right placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
				/>
			</div>

			{/* Next */}
			<button
				onClick={onNext}
				disabled={!paymentMethod}
				className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-200 disabled:opacity-50 transition-all active:scale-[0.98]"
			>
				<ChevronLeft size={20} />
				<span>مراجعة الطلب</span>
				<span />
			</button>
		</div>
	);
}