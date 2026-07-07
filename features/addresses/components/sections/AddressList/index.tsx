import Link from "next/link";
import { MapPin } from "lucide-react";
import { getAddresses } from "@/features/addresses/api/addresses";
import { AddressListClient } from "./AddressListClient";
import AddressListSkeleton from "./skeleton";

export { AddressListSkeleton as skeleton };

export async function AddressList() {
	const addresses = await getAddresses();

	if (addresses.length === 0) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-14 sm:gap-5 sm:px-6 sm:py-20 md:py-24">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 sm:h-16 sm:w-16 md:h-20 md:w-20">
					<MapPin className="h-7 w-7 text-gray-300 dark:text-gray-600 sm:h-8 sm:w-8" aria-hidden />
				</div>
				<p className="text-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
					لا توجد عناوين محفوظة
				</p>
				<Link
					href="/addresses/add"
					className="min-h-[48px] rounded-2xl bg-[#30913F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2a8036] active:bg-[#267332] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 sm:px-8"
				>
					أضف عنوانك الأول
				</Link>
			</div>
		);
	}

	return <AddressListClient addresses={addresses} />;
}
