import { getAddressDetail } from "@/features/addresses/api/address-detail";
import { AddressDetailClient } from "./AddressDetailClient";
import AddressDetailSkeleton from "./skeleton";

export { AddressDetailSkeleton as skeleton };

export async function AddressDetail({ id }: { id: string }) {
	const address = await getAddressDetail(id);

	if (!address) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center px-4 py-14 sm:px-6 sm:py-20 md:py-24">
				<p className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
					لم يتم العثور على العنوان
				</p>
			</div>
		);
	}

	return <AddressDetailClient address={address} />;
}
