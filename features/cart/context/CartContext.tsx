"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "../actions/add-to-cart";
import { updateCart } from "../actions/update-cart";
import { clearCart } from "../actions/clear-cart";
import { removeCartItem } from "../actions/remove-cart-item";
import { CART_SYNC_DEBOUNCE_MS } from "../constants";
import { applyOptimisticQuantity, isOptimisticCartLine } from "../lib/optimistic-cart";
import { getTotalCount, getTotalPrice, matchCartLine, ProductCartMeta } from "../lib/match-cart-line";
import { CartActionResult, CartItem } from "../types/cart.types";

interface CartMutationResult {
    success: boolean;
    message?: string;
}

interface CartContextValue {
    items: CartItem[];
    totalCount: number;
    totalPrice: number;
    getQuantity: (product: ProductCartMeta) => number;
    addProduct: (product: ProductCartMeta, quantity?: number) => Promise<CartMutationResult>;
    incrementProduct: (product: ProductCartMeta) => Promise<CartMutationResult>;
    decrementProduct: (product: ProductCartMeta) => Promise<CartMutationResult>;
    removeProduct: (product: ProductCartMeta) => Promise<CartMutationResult>;
    clearAllProducts: () => Promise<CartMutationResult>;
    isProductPending: (productId: number) => boolean;
    getProductSyncError: (productId: number) => string | undefined;
    clearProductError: (productId: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
    initialItems: CartItem[];
    children: React.ReactNode;
}

export function CartProvider({ initialItems, children }: CartProviderProps) {
    const router = useRouter();
    const [items, setItems] = useState(initialItems);
    const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());
    const [syncErrors, setSyncErrors] = useState<Record<number, string>>({});

    const itemsRef = useRef(items);
    const serverItemsRef = useRef(initialItems);
    const debounceTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const inFlightRef = useRef<Set<number>>(new Set());

    itemsRef.current = items;

    useEffect(() => {
        setItems(initialItems);
        serverItemsRef.current = initialItems;
    }, [initialItems]);

    useEffect(() => {
        const timers = debounceTimersRef.current;
        return () => {
            timers.forEach((timer) => clearTimeout(timer));
            timers.clear();
        };
    }, []);

    const totalCount = useMemo(() => getTotalCount(items), [items]);
    const totalPrice = useMemo(() => getTotalPrice(items), [items]);
    const getQuantity = useCallback(
        (product: ProductCartMeta) => matchCartLine(items, product)?.quantity ?? 0,
        [items]
    );

    const isProductPending = useCallback(
        (productId: number) => syncingIds.has(productId),
        [syncingIds]
    );

    const getProductSyncError = useCallback(
        (productId: number) => syncErrors[productId],
        [syncErrors]
    );

    const clearProductError = useCallback((productId: number) => {
        setSyncErrors((prev) => {
            if (!prev[productId]) return prev;
            const next = { ...prev };
            delete next[productId];
            return next;
        });
    }, []);

    const setProductSyncing = useCallback((productId: number, syncing: boolean) => {
        setSyncingIds((prev) => {
            const next = new Set(prev);
            if (syncing) next.add(productId);
            else next.delete(productId);
            return next;
        });
    }, []);

    const clearDebounce = useCallback((productId: number) => {
        const timer = debounceTimersRef.current.get(productId);
        if (!timer) return;

        clearTimeout(timer);
        debounceTimersRef.current.delete(productId);
    }, []);

    const applyServerItems = useCallback(
        (nextItems: CartItem[]) => {
            serverItemsRef.current = nextItems;
            setItems(nextItems);
            router.refresh();
        },
        [router]
    );

    const rollback = useCallback((productId: number, message: string) => {
        setItems(serverItemsRef.current);
        setSyncErrors((prev) => ({ ...prev, [productId]: message }));
    }, []);

    const finishSyncing = useCallback(
        (productId: number) => {
            if (!debounceTimersRef.current.has(productId) && !inFlightRef.current.has(productId)) {
                setProductSyncing(productId, false);
            }
        },
        [setProductSyncing]
    );

    const executeSync = useCallback(
        async (product: ProductCartMeta) => {
            const productId = product.id;

            if (inFlightRef.current.has(productId)) return;

            const quantity = matchCartLine(itemsRef.current, product)?.quantity ?? 0;
            const serverQuantity =
                matchCartLine(serverItemsRef.current, product)?.quantity ?? 0;

            if (quantity === serverQuantity) {
                finishSyncing(productId);
                return;
            }

            inFlightRef.current.add(productId);
            setProductSyncing(productId, true);

            let result: CartActionResult;

            try {
                const line = matchCartLine(itemsRef.current, product);
                const serverLine = matchCartLine(serverItemsRef.current, product);

                if (quantity <= 0) {
                    result = serverLine
                        ? await removeCartItem(serverLine.id)
                        : { success: true, items: serverItemsRef.current };
                } else if (!line || isOptimisticCartLine(line.id)) {
                    result = await addToCart({ item_id: productId, quantity });
                } else {
                    result = await updateCart({ cart_id: line.id, quantity });
                }

                if (result.success && result.items) {
                    const latestQuantity =
                        matchCartLine(itemsRef.current, product)?.quantity ?? 0;

                    if (latestQuantity === quantity) {
                        applyServerItems(result.items);
                    } else {
                        serverItemsRef.current = result.items;
                        setItems(applyOptimisticQuantity(result.items, product, latestQuantity));
                    }

                    clearProductError(productId);
                } else {
                    rollback(productId, result.message ?? "حدث خطأ");
                }
            } finally {
                inFlightRef.current.delete(productId);

                const latestQuantity =
                    matchCartLine(itemsRef.current, product)?.quantity ?? 0;
                const serverQuantity =
                    matchCartLine(serverItemsRef.current, product)?.quantity ?? 0;

                if (latestQuantity !== serverQuantity) {
                    void executeSync(product);
                } else {
                    finishSyncing(productId);
                }
            }
        },
        [applyServerItems, clearProductError, finishSyncing, rollback, setProductSyncing]
    );

    const scheduleSync = useCallback(
        (product: ProductCartMeta) => {
            const productId = product.id;

            clearDebounce(productId);
            setProductSyncing(productId, true);

            debounceTimersRef.current.set(
                productId,
                setTimeout(() => {
                    debounceTimersRef.current.delete(productId);
                    void executeSync(product);
                }, CART_SYNC_DEBOUNCE_MS)
            );
        },
        [clearDebounce, executeSync, setProductSyncing]
    );

    const mutateQuantity = useCallback(
        (product: ProductCartMeta, getNextQuantity: (current: number) => number) => {
            clearProductError(product.id);

            setItems((prev) => {
                const current = matchCartLine(prev, product)?.quantity ?? 0;
                return applyOptimisticQuantity(prev, product, getNextQuantity(current));
            });

            scheduleSync(product);
            return { success: true };
        },
        [clearProductError, scheduleSync]
    );

    const addProduct = useCallback(
        (product: ProductCartMeta, quantity = 1) => {
            return Promise.resolve(
                mutateQuantity(product, (current) => current + quantity)
            );
        },
        [mutateQuantity]
    );

    const incrementProduct = useCallback(
        (product: ProductCartMeta) => {
            return Promise.resolve(mutateQuantity(product, (current) => current + 1));
        },
        [mutateQuantity]
    );

    const decrementProduct = useCallback(
        (product: ProductCartMeta) => {
            const current = matchCartLine(itemsRef.current, product)?.quantity ?? 0;
            if (current <= 0) return Promise.resolve({ success: true });

            return Promise.resolve(mutateQuantity(product, (qty) => qty - 1));
        },
        [mutateQuantity]
    );

    const removeProduct = useCallback(
        (product: ProductCartMeta) => {
            return Promise.resolve(mutateQuantity(product, () => 0));
        },
        [mutateQuantity]
    );

    const clearAllProducts = useCallback(async () => {
        const previousServerItems = serverItemsRef.current;
        setItems([]);
        setSyncErrors({});

        debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
        debounceTimersRef.current.clear();
        inFlightRef.current.clear();
        setSyncingIds(new Set());

        const result = await clearCart();

        if (result.success) {
            serverItemsRef.current = [];
            router.refresh();
            return { success: true };
        }

        setItems(previousServerItems);
        return { success: false, message: result.message ?? "تعذّر تفريغ السلة" };
    }, [router]);

    const value = useMemo(
        () => ({
            items,
            totalCount,
            totalPrice,
            getQuantity,
            addProduct,
            incrementProduct,
            decrementProduct,
            removeProduct,
            clearAllProducts,
            isProductPending,
            getProductSyncError,
            clearProductError,
        }),
        [
            items,
            totalCount,
            totalPrice,
            getQuantity,
            addProduct,
            incrementProduct,
            decrementProduct,
            removeProduct,
            clearAllProducts,
            isProductPending,
            getProductSyncError,
            clearProductError,
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
