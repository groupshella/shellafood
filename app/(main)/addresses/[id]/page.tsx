import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import {
	AddressDetail,
	skeleton as AddressDetailSkeleton,
} from "@/features/addresses/components/sections/AddressDetail";
import { isArabicLocale } from "@/shared/lib/locale";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "تفاصيل العنوان | شيلة فود" : "Address details | Shella Food",
		description: isArabic
			? "عرض تفاصيل عنوان التوصيل"
			: "View delivery address details",
	};
}

export default async function AddressDetailPage({ params }: Props) {
	const { id } = await params;
	const isArabic = await isArabicLocale();

	return (
		<AddressesShell
			title={isArabic ? "تفاصيل العنوان" : "Address details"}
			isArabic={isArabic}
		>
			<Suspense fallback={<AddressDetailSkeleton />}>
				<AddressDetail id={id} />
			</Suspense>
		</AddressesShell>
	);
}
