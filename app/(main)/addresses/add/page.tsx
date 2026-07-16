import type { Metadata } from "next";
import { AddressesShell } from "@/features/addresses/components/AddressesShell";
import { AddAddressClient } from "@/features/addresses/components/sections/AddressForm/AddAddressClient";
import { isArabicLocale } from "@/shared/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
	const isArabic = await isArabicLocale();
	return {
		title: isArabic ? "إضافة عنوان | شيلة فود" : "Add address | Shella Food",
		description: isArabic
			? "أضف عنوان توصيل جديداً على الخريطة"
			: "Add a new delivery address on the map",
	};
}

export default async function AddAddressPage() {
	const isArabic = await isArabicLocale();

	return (
		<AddressesShell
			title={isArabic ? "إضافة عنوان جديد" : "Add new address"}
			isArabic={isArabic}
		>
			<AddAddressClient isArabic={isArabic} />
		</AddressesShell>
	);
}
