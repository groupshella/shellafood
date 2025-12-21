"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransactionsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		console.error("Transactions Error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-red-50/20 dark:via-red-900/10 to-white dark:to-gray-900 p-4 md:p-6 lg:p-8 flex items-center justify-center" dir="rtl">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
					<AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
				</div>

				<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
					حدث خطأ أثناء تحميل المعاملات
				</h1>

				<p className="text-gray-600 dark:text-gray-400 mb-8">
					عذراً، لم نتمكن من تحميل سجل المعاملات. يرجى المحاولة مرة أخرى.
				</p>

				{error.message && (
					<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
						<p className="text-sm text-red-800 dark:text-red-300 text-right">
							{error.message}
						</p>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={() => reset()}
						className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg hover:shadow-xl active:scale-95"
					>
						<RefreshCw className="w-5 h-5" />
						<span>إعادة المحاولة</span>
					</button>

					<button
						onClick={() => router.push('/profile/kaidha-wallet')}
						className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold active:scale-95"
					>
						<ArrowLeft className="w-5 h-5" />
						<span>العودة</span>
					</button>
				</div>
			</div>
		</div>
	);
}

