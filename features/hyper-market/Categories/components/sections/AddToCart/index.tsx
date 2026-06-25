"use client";

import { AddToCartClient } from "@/features/item/components/sections/AddToCart/AddToCartClient";

interface AddToCartProps {
    moduleId: string;
}

export function AddToCart({ moduleId }: AddToCartProps) {
    return <AddToCartClient moduleId={moduleId} />;
}
