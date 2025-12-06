export default function OffersLoading() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
			{/* Header Skeleton */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 animate-pulse mb-4"></div>
					<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 max-w-full animate-pulse"></div>
				</div>
			</div>

			{/* Offers Grid Skeleton */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse"
						>
							{/* Image Skeleton */}
							<div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
							
							{/* Content Skeleton */}
							<div className="p-4 space-y-3">
								<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
								<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
								<div className="flex items-center justify-between pt-2">
									<div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
									<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

