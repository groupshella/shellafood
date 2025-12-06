"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function OfferDetailsError({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error("Offer details page error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4" dir="rtl">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
				<div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
					<AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
				</div>

				<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
					حدث خطأ ما!
				</h1>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					فشل تحميل تفاصيل العرض. لا تقلق، يمكنك المحاولة مرة أخرى.
				</p>

				{process.env.NODE_ENV === "development" && (
					<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 mb-6 text-right">
						<p className="text-xs text-red-800 dark:text-red-300 font-mono break-all">
							{error.message}
						</p>
					</div>
				)}

				<div className="flex flex-col sm:flex-row gap-3">
					<button
						onClick={reset}
						className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
					>
						<RefreshCw className="w-4 h-4" />
						حاول مرة أخرى
					</button>
					
					<Link
						href="/"
						className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
					>
						<Home className="w-4 h-4" />
						الرئيسية
					</Link>
				</div>

				<p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
					تحتاج مساعدة؟{" "}
					<Link href="/profile/support" className="text-green-600 dark:text-green-400 hover:underline">
						اتصل بالدعم
					</Link>
				</p>
			</div>
		</div>
	);
}

