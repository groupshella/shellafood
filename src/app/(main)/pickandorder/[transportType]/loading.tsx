import { Loader2, Bike, Truck } from "lucide-react";

/**
 * Loading Component for Transport Type Page
 * Professional loading state with transport type icon
 */
export default function TransportTypeLoading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="text-center">
				<div className="relative mb-6">
					<div className="absolute inset-0 flex items-center justify-center">
						<Loader2 className="h-16 w-16 animate-spin text-green-500" />
					</div>
					<div className="relative flex items-center justify-center">
						<Bike className="h-12 w-12 text-gray-400 dark:text-gray-600" />
					</div>
				</div>
				<p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
					جاري التحميل...
				</p>
			</div>
		</div>
	);
}

