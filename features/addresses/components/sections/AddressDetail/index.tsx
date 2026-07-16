import { getAddressDetail } from "@/features/addresses/api/address-detail";
import { isArabicLocale } from "@/shared/lib/locale";
import { AddressDetailClient } from "./AddressDetailClient";
import AddressDetailSkeleton from "./skeleton";

export { AddressDetailSkeleton as skeleton };

export async function AddressDetail({ id }: { id: string }) {
	const isArabic = await isArabicLocale();
	const lang = isArabic ? "ar" : "en";
	const address = await getAddressDetail(id, lang);

	if (!address) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center px-4 py-14 sm:px-6 sm:py-20 md:py-24">
				<p className="text-center text-sm text-muted sm:text-base">
					{isArabic ? "لم يتم العثور على العنوان" : "Address not found"}
				</p>
			</div>
		);
	}

	return <AddressDetailClient address={address} isArabic={isArabic} />;
}
