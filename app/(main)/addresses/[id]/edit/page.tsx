import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import {
	EditAddress,
	skeleton as EditAddressSkeleton,
} from "@/features/addresses/components/sections/EditAddress";
import { isArabicLocale } from "@/shared/lib/locale";

interface Props {
	params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "تعديل العنوان | شيلة فود" : "Edit address | Shella Food",
		description: isArabic
			? "تعديل بيانات عنوان التوصيل"
			: "Edit delivery address details",
	};
}

export default async function EditAddressPage({ params }: Props) {
	const { id } = await params;
	const isArabic = await isArabicLocale();

	return (
		<AddressesShell
			title={isArabic ? "تعديل العنوان" : "Edit address"}
			isArabic={isArabic}
		>
			<Suspense fallback={<EditAddressSkeleton />}>
				<EditAddress id={id} />
			</Suspense>
		</AddressesShell>
	);
}
