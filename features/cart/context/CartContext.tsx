"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "../actions/add-to-cart";
import { updateCart } from "../actions/update-cart";
import { removeCartItem } from "../actions/remove-cart-item";
import { getTotalCount, matchCartLine, ProductCartMeta } from "../lib/match-cart-line";
import { CartItem } from "../types/cart.types";

interface CartMutationResult {
    success: boolean;
    message?: string;
}

interface CartContextValue {
    items: CartItem[];
    totalCount: number;
    getQuantity: (product: ProductCartMeta) => number;
    addProduct: (product: ProductCartMeta, quantity?: number) => Promise<CartMutationResult>;
    incrementProduct: (product: ProductCartMeta) => Promise<CartMutationResult>;
    decrementProduct: (product: ProductCartMeta) => Promise<CartMutationResult>;
    isProductPending: (productId: number) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    initialItems: CartItem[];
    children: React.ReactNode;
}

export function CartProvider({ initialItems, children }: CartProviderProps) {
    const router = useRouter();
    const [items, setItems] = useState(initialItems);
    const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
    const [, startTransition] = useTransition();

    useEffect(() => {
        setItems(initialItems);
    }, [initialItems]);

    const totalCount = useMemo(() => getTotalCount(items), [items]);

    const getQuantity = useCallback(
        (product: ProductCartMeta) => matchCartLine(items, product)?.quantity ?? 0,
        [items]
    );

    const isProductPending = useCallback(
        (productId: number) => pendingIds.has(productId),
        [pendingIds]
    );

    const runMutation = useCallback(
        (productId: number, action: () => Promise<CartMutationResult>) => {
            setPendingIds((prev) => new Set(prev).add(productId));

            return new Promise<CartMutationResult>((resolve) => {
                startTransition(async () => {
                    const result = await action();
                    setPendingIds((prev) => {
                        const next = new Set(prev);
                        next.delete(productId);
                        return next;
                    });
                    resolve(result);
                });
            });
        },
        []
    );

    const applyItems = useCallback(
        (nextItems: CartItem[]) => {
            setItems(nextItems);
            router.refresh();
        },
        [router]
    );

    const addProduct = useCallback(
        async (product: ProductCartMeta, quantity = 1) => {
            return runMutation(product.id, async () => {
                const result = await addToCart({ item_id: product.id, quantity });

                if (result.success && result.items) {
                    applyItems(result.items);
                    return { success: true };
                }

                return { success: false, message: result.message ?? "حدث خطأ" };
            });
        },
        [applyItems, runMutation]
    );

    const incrementProduct = useCallback(
        async (product: ProductCartMeta) => {
            const line = matchCartLine(items, product);

            if (!line) {
                return addProduct(product, 1);
            }

            return runMutation(product.id, async () => {
                const result = await updateCart({
                    cart_id: line.id,
                    quantity: line.quantity + 1,
                });

                if (result.success && result.items) {
                    applyItems(result.items);
                    return { success: true };
                }

                return { success: false, message: result.message ?? "حدث خطأ" };
            });
        },
        [addProduct, applyItems, items, runMutation]
    );

    const decrementProduct = useCallback(
        async (product: ProductCartMeta) => {
            const line = matchCartLine(items, product);
            if (!line) return { success: true };

            return runMutation(product.id, async () => {
                const result =
                    line.quantity <= 1
                        ? await removeCartItem(line.id)
                        : await updateCart({
                              cart_id: line.id,
                              quantity: line.quantity - 1,
                          });

                if (result.success && result.items) {
                    applyItems(result.items);
                    return { success: true };
                }

                return { success: false, message: result.message ?? "حدث خطأ" };
            });
        },
        [applyItems, items, runMutation]
    );

    const value = useMemo(
        () => ({
            items,
            totalCount,
            getQuantity,
            addProduct,
            incrementProduct,
            decrementProduct,
            isProductPending,
        }),
        [
            items,
            totalCount,
            getQuantity,
            addProduct,
            incrementProduct,
            decrementProduct,
            isProductPending,
        ]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
