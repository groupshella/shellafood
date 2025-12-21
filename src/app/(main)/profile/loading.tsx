/**
 * Profile Loading Component
 * Clean and professional skeleton loading for profile pages
 */
export default function ProfileLoading() {
	return (
		<div className="min-h-screen bg-gray-100 dark:bg-gray-900" dir="rtl">
			<div className="flex min-h-screen items-center justify-center p-4">
				{/* Main Container Skeleton */}
				<div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/50 md:flex-row">
					{/* Sidebar Skeleton */}
					<div className="hidden w-[420px] border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-6 py-8 md:block">
						<div className="space-y-6">
							{/* Profile Header Skeleton */}
							<div className="flex items-center space-x-4 space-x-reverse">
								<div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
								<div className="flex-1">
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
									<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
								</div>
							</div>

							{/* Menu Items Skeleton */}
							<div className="space-y-3">
								{[...Array(8)].map((_, i) => (
									<div key={i} className="flex items-center space-x-3 space-x-reverse">
										<div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
									</div>
								))}
							</div>

							{/* Logout Button Skeleton */}
							<div className="pt-6 border-t border-gray-200 dark:border-gray-700">
								<div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
							</div>
						</div>
					</div>

					{/* Content Area Skeleton */}
					<div className="flex-1 p-4 md:p-8">
						{/* Page Title Skeleton */}
						<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-8 animate-pulse"></div>

						{/* Content Cards Skeleton */}
						<div className="space-y-6">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6">
								<div className="space-y-4">
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
									<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
								</div>
							</div>

							<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 border border-gray-200 dark:border-gray-700 p-6">
								<div className="space-y-4">
									<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{[...Array(4)].map((_, i) => (
											<div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Loading Indicator */}
			<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
				<div className="flex items-center space-x-3 space-x-reverse">
					<div className="w-5 h-5 border-2 border-green-500 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
					<span className="text-sm text-gray-600 dark:text-gray-300 font-medium">جاري التحميل...</span>
				</div>
			</div>
		</div>
	);
}
