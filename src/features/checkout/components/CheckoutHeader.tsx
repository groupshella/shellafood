'use client';

import { ArrowRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const STEP_LABELS: Record<string, string> = {
	address: 'عنوان التوصيل',
	payment: 'طريقة الدفع',
	confirm: 'تأكيد الطلب',
};

interface CheckoutHeaderProps {
	step: string;
	stepIndex: number;
	totalSteps: number;
	onBack: () => void;
}

export function CheckoutHeader({ step, stepIndex, totalSteps, onBack }: CheckoutHeaderProps) {
	const router = useRouter();

	return (
		<div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
			<div className="max-w-2xl mx-auto px-4">
				{/* Top row */}
				<div className="flex items-center justify-between h-14">
					<button
						onClick={stepIndex === 0 ? () => router.back() : onBack}
						className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
					>
						<ArrowRight size={18} className="text-gray-700" />
					</button>

					<div className="text-center">
						<p className="text-xs text-gray-400 font-medium">
							خطوة {stepIndex + 1} من {totalSteps}
						</p>
						<h1 className="text-sm font-bold text-gray-900">{STEP_LABELS[step]}</h1>
					</div>

					<button
						onClick={() => router.back()}
						className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
					>
						<X size={18} className="text-gray-500" />
					</button>
				</div>

				{/* Progress bar */}
				<div className="h-0.5 bg-gray-100 mb-0">
					<div
						className="h-full bg-emerald-500 transition-all duration-500 ease-out"
						style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
					/>
				</div>
			</div>
		</div>
	);
}