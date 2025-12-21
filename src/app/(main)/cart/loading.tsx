// app/cart/loading.tsx
export default function CartLoading() {
	return (
	  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
		{/* Navigation Skeleton */}
		<div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 animate-pulse" />
		
		{/* Cart Content Skeleton */}
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			
			{/* Cart Items Skeleton */}
			<div className="lg:col-span-2 space-y-4">
			  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-6" />
			  
			  {/* Item Cards */}
			  {[1, 2, 3].map((i) => (
				<div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 animate-pulse border border-gray-200 dark:border-gray-700">
				  <div className="flex gap-4">
					<div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded" />
					<div className="flex-1 space-y-3">
					  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
					  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
					  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
					</div>
				  </div>
				</div>
			  ))}
			</div>
			
			{/* Order Summary Skeleton */}
			<div className="lg:col-span-1">
			  <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 sticky top-4 border border-gray-200 dark:border-gray-700">
				<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-4" />
				<div className="space-y-3">
				  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
					<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
				  </div>
				  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-4" />
				</div>
			  </div>
			</div>
		  </div>
		</div>
		
		{/* Footer Skeleton */}
		<div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse mt-8" />
	  </div>
	);
  }