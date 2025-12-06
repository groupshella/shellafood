"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		console.error("Choose driver page error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4" dir="rtl">
			<div className="text-center max-w-md">
				<div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
					<AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
					حدث خطأ
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-8">
					عذراً، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => reset()}
						className="flex items-center justify-center gap-2 px-6 py-3 bg-[#31A342] hover:bg-[#2a8f38] text-white font-semibold rounded-lg transition-colors"
					>
						<RefreshCw className="w-5 h-5" />
						حاول مرة أخرى
					</button>
					<button
						onClick={() => router.push("/pickandorder")}
						className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold rounded-lg transition-colors"
					>
						<ArrowLeft className="w-5 h-5 rotate-180" />
						العودة للرئيسية
					</button>
				</div>
			</div>
		</div>
	);
}

