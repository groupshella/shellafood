"use client";

import { useCallback, useEffect, useState } from "react";
import { AddressListItem } from "../types/address.types";

const STORAGE_KEY = "shellafood_selected_address_id";

export function useSelectedAddress(addresses: AddressListItem[]) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        if (addresses.length === 0) {
            setSelectedId(null);
            return;
        }

        const stored = localStorage.getItem(STORAGE_KEY);
        const storedId = stored ? Number(stored) : null;

        if (storedId && addresses.some((address) => address.id === storedId)) {
            setSelectedId(storedId);
            return;
        }

        setSelectedId(addresses[0].id);
        localStorage.setItem(STORAGE_KEY, String(addresses[0].id));
    }, [addresses]);

    const setSelectedAddressId = useCallback((id: number) => {
        setSelectedId(id);
        localStorage.setItem(STORAGE_KEY, String(id));
    }, []);

    const selectedAddress =
        addresses.find((address) => address.id === selectedId) ?? addresses[0] ?? null;

    return { selectedAddress, selectedId, setSelectedAddressId };
}
