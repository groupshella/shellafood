import { Metadata } from "next";
import { Suspense } from "react";
import { NavBarCondition } from "@/components/Profile";
import ShellaFooter from "@/components/ShellaFooter/ShellaFooter";
import WaitingDriverPage from "@/components/PickAndOrder/Order/WaitingDriverPage";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ transportType: string }>;
}): Promise<Metadata> {
	const { transportType } = await params;
	const isMotorbike = transportType === "motorbike";

	return {
		title: isMotorbike
			? "في انتظار السائق - دراجة نارية | شلة فود"
			: "في انتظار السائق - شاحنة | شلة فود",
		description: isMotorbike
			? "في انتظار قبول السائق لطلب التوصيل بالدراجة النارية"
			: "في انتظار قبول السائق لطلب التوصيل بالشاحنة",
	};
}

function LoadingFallback() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
			<div className="text-center">
				<div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
				<p className="text-gray-600 dark:text-gray-400">Loading...</p>
			</div>
		</div>
	);
}

export default async function WaitingDriverRoutePage({
	params,
}: {
	params: Promise<{ transportType: string }>;
}) {
	const { transportType } = await params;

	return (
		<>
			<NavBarCondition />
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
				<Suspense fallback={<LoadingFallback />}>
					<WaitingDriverPage transportType={transportType} />
				</Suspense>
			</main>
			<ShellaFooter />
		</>
	);
}

