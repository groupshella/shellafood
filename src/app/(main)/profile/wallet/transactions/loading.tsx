export default function WalletTransactionsLoading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 dark:from-gray-900 via-green-50/20 dark:via-green-900/10 to-white dark:to-gray-900 p-3 sm:p-4 md:p-6 lg:p-8" dir="rtl">
			<div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
				{/* Header Skeleton */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
					<div className="flex items-center gap-3 sm:gap-4">
						<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
						<div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
						<div>
							<div className="w-32 sm:w-40 h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
							<div className="w-24 sm:w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						</div>
					</div>
					<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
				</div>

				{/* Summary Cards Skeleton */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
								<div className="w-20 sm:w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
							</div>
							<div className="w-28 sm:w-32 h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						</div>
					))}
				</div>

				{/* Filters Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 sm:p-4">
					<div className="flex items-center gap-2 mb-3">
						<div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
						<div className="w-24 sm:w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
					</div>
					<div className="flex flex-wrap gap-2">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="w-16 sm:w-20 h-8 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
						))}
					</div>
				</div>

				{/* Transactions List Skeleton */}
				<div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
					<div className="divide-y divide-gray-200 dark:divide-gray-700">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="p-4 sm:p-6">
								<div className="flex items-start justify-between gap-4">
									<div className="flex items-start gap-3 flex-1">
										<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
										<div className="flex-1 space-y-2">
											<div className="w-24 sm:w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
											<div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
											<div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
											<div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										</div>
									</div>
									<div className="space-y-2">
										<div className="w-24 sm:w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										<div className="w-20 sm:w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

