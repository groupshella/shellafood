import type { CheckoutData, SavedAddress } from "@/features/checkout/types/checkout.types";

export const MOCK_ADDRESSES: SavedAddress[] = [
    { id: 1, label: "المنزل", address: "الرياض ، طريق الخليج 4423 ، رقم الدور 2 ، شقة 2" },
    { id: 2, label: "العمل", address: "الرياض ، اسم المنطقة ، اسم الشارع" },
];

export const MOCK_CHECKOUT: CheckoutData = {
    cartCount: 4,
    cartItems: [
        { id: 1, name: "منتج 1" },
        { id: 2, name: "منتج 2" },
        { id: 3, name: "منتج 3" },
        { id: 4, name: "منتج 4" },
    ],
    deliveryMethod: "delivery",
    deliveryAddress: "الرياض ، طريق الخليج 4423 ، رقم الدور 2 ، شقة 2",
    deliveryAddressShort: "اسم مختصر للعنوان",
    walletBalance: "00.0",
    myWalletBalance: "00.0",
    invoice: {
        subtotal: "31.95 ﷼",
        deliveryFee: "20.00 ﷼",
        serviceFee: "20.00 ﷼",
        discount: "20.00 ﷼",
        total: "51.95 ﷼",
    },
};
