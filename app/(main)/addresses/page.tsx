import { Suspense } from "react";
import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import {
	AddressList,
	skeleton as AddressListSkeleton,
} from "@/features/addresses/components/sections/AddressList";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic
			? "عناوين التوصيل | شيلة فود"
			: "Delivery addresses | Shella Food",
		description: isArabic
			? "إدارة عناوين التوصيل المحفوظة"
			: "Manage your saved delivery addresses",
	};
}

export default async function AddressesPage() {
	const isArabic = await isArabicLocale();

	return (
		<AddressesShell
			title={isArabic ? "عناوين التوصيل" : "Delivery addresses"}
			isArabic={isArabic}
			showAddButton
		>
			<Suspense fallback={<AddressListSkeleton />}>
				<AddressList />
			</Suspense>
		</AddressesShell>
	);
}
