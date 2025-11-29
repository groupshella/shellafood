"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
			<div className="text-center max-w-md">
				<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
				<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
					Something went wrong!
				</h2>
				<p className="text-gray-600 dark:text-gray-400 mb-6">
					Failed to load offer details
				</p>
				<button
					onClick={reset}
					className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
				>
					Try again
				</button>
			</div>
		</div>
	);
}

