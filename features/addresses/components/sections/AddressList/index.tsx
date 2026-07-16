import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAddresses } from "@/features/addresses/api/addresses";
import { isArabicLocale } from "@/shared/lib/locale";
import { AddressListClient } from "./AddressListClient";
import AddressListSkeleton from "./skeleton";

export { AddressListSkeleton as skeleton };

export async function AddressList() {
	const isArabic = await isArabicLocale();
	const lang = isArabic ? "ar" : "en";
	const addresses = await getAddresses(lang);

	if (addresses.length === 0) {
		return (
			<div
				dir={isArabic ? "rtl" : "ltr"}
				lang={isArabic ? "ar" : "en"}
				className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-14 sm:gap-5 sm:px-6 sm:py-20 md:py-24"
			>
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-card sm:h-16 sm:w-16 md:h-20 md:w-20">
					<MapPin className="h-7 w-7 text-muted sm:h-8 sm:w-8" aria-hidden />
				</div>
				<p className="text-center text-sm text-muted sm:text-base">
					{isArabic ? "لا توجد عناوين محفوظة" : "No saved addresses"}
				</p>
				<Link
					href="/addresses/add"
					className="min-h-[48px] rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-colors hover:brightness-95 active:brightness-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-8"
				>
					{isArabic ? "أضف عنوانك الأول" : "Add your first address"}
				</Link>
			</div>
		);
	}

	return <AddressListClient addresses={addresses} isArabic={isArabic} />;
}
