import { getAddresses } from "@/features/addresses/api/addresses";
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
        const addresses = isAuthenticated ? await getAddresses() : [];

        return (
            <AddressTopbarBannerClient
                isAuthenticated={isAuthenticated}
                addresses={addresses}
                className={className}
            />
        );
    },
    { skeleton: AddressTopbarBannerSkeleton }
);
