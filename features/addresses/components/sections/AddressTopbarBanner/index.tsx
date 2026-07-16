import { getAddresses } from "@/features/addresses/api/addresses";
import { isArabicLocale } from "@/shared/lib/locale";
import { AddressTopbarBannerClient } from "./AddressTopbarBannerClient";
import AddressTopbarBannerSkeleton from "./skeleton";

interface AddressTopbarBannerProps {
	isAuthenticated: boolean;
	className?: string;
}

export const AddressTopbarBanner = Object.assign(
	async function AddressTopbarBanner({
		isAuthenticated,
		className,
	}: AddressTopbarBannerProps) {
		const isArabic = await isArabicLocale();
		const lang = isArabic ? "ar" : "en";
		const addresses = isAuthenticated ? await getAddresses(lang) : [];

		return (
			<AddressTopbarBannerClient
				isAuthenticated={isAuthenticated}
				addresses={addresses}
				isArabic={isArabic}
				className={className}
			/>
		);
	},
	{ skeleton: AddressTopbarBannerSkeleton }
);
