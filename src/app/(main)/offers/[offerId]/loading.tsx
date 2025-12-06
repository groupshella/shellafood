export default function OfferDetailsLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
			{/* Header Skeleton */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center gap-4">
						<div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
						<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
					</div>
				</div>
			</div>

			{/* Content Skeleton */}
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Image Skeleton */}
				<div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8 animate-pulse"></div>

				{/* Title Skeleton */}
				<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-4 animate-pulse"></div>

				{/* Description Skeleton */}
				<div className="space-y-3 mb-8">
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
					<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
				</div>

				{/* Details Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
							<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3 animate-pulse"></div>
							<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
						</div>
					))}
				</div>

				{/* Action Button Skeleton */}
				<div className="flex gap-4">
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 animate-pulse"></div>
					<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-48 animate-pulse"></div>
				</div>
			</div>
		</div>
	);
}

