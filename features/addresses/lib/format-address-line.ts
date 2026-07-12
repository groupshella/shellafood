import type { AddressListItem } from "../types/address.types";

export function formatAddressLine(
    address: AddressListItem,
    isArabic = true,
): string {
    const separator = isArabic ? " ، " : ", ";
    return [address.city, address.region, address.street_name]
        .filter(Boolean)
        .join(separator);
}
