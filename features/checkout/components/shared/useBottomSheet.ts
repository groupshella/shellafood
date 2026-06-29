"use client";

import { useCallback, useState } from "react";

export function useBottomSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const open = useCallback(() => {
        setIsOpen(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    }, []);

    const close = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 350);
    }, []);

    return { isOpen, isVisible, open, close };
}
