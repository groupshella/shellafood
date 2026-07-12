import { getAddresses } from "@/features/addresses/api/addresses";
import { AddressTopbarBannerClient } from "./AddressTopbarBannerClient";
import AddressTopbarBannerSkeleton from "./skeleton";

interface AddressTopbarBannerProps {
    isAuthenticated: boolean;
    className?: string;
    isArabic: boolean;
}

export const AddressTopbarBanner = Object.assign(
    async function AddressTopbarBanner({
        isAuthenticated,
        className,
        isArabic,
    }: AddressTopbarBannerProps) {
        const addresses = isAuthenticated ? await getAddresses({ isArabic }) : [];

        return (
            <AddressTopbarBannerClient
                isAuthenticated={isAuthenticated}
                addresses={addresses}
                className={className}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: AddressTopbarBannerSkeleton }
);
