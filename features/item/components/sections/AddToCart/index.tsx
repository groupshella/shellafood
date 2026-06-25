import { AddToCartClient } from "./AddToCartClient";

export const AddToCart = Object.assign(
    function AddToCart({ moduleId }: { moduleId?: string } = {}) {
        return <AddToCartClient moduleId={moduleId} />;
    },
    { skeleton: () => null }
);
