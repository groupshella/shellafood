import { cookies } from "next/headers";
import { getAddresses } from "@/features/addresses/api/addresses";
import { COOKIE_KEYS } from "@/features/auth/types/auth.types";
import { DeliveryMethodClient } from "./DeliveryMethodClient";
import DeliveryMethodSkeleton from "./skeleton";

export const DeliveryMethod = Object.assign(
    async function DeliveryMethod() {
        const cookieStore = await cookies();
        const isAuthenticated = !!cookieStore.get(COOKIE_KEYS.ACCESS_TOKEN)?.value;
        const addresses = isAuthenticated ? await getAddresses() : [];

        return (
            <DeliveryMethodClient
                isAuthenticated={isAuthenticated}
                addresses={addresses}
            />
        );
    },
    { skeleton: DeliveryMethodSkeleton }
);
