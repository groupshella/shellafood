import { Suspense } from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getCart } from "@/features/cart/api/cart";
import { getAddresses } from "@/features/addresses/api/addresses";
import { formatAddressLine } from "@/features/addresses/lib/format-address-line";
import { getServerLocale } from "@/features/language/getServerLocale";
import { CheckoutShell } from "@/features/checkout/components/CheckoutShell";
import { CartSummary } from "@/features/checkout/components/sections/CartSummary";
import { DeliveryMethod } from "@/features/checkout/components/sections/DeliveryMethod";
import { PaymentMethod } from "@/features/checkout/components/sections/PaymentMethod";
import { DiscountCode } from "@/features/checkout/components/sections/DiscountCode";
import { AdditionalNote } from "@/features/checkout/components/sections/AdditionalNote";
import { InvoiceDetails } from "@/features/checkout/components/sections/InvoiceDetails";
import { COOKIE_KEYS, type AuthUser } from "@/features/auth/types/auth.types";
import { formatPrice } from "@/features/home/components/shared/PriceTag";
import type { CheckoutData } from "@/features/checkout/types/checkout.types";
import { AuthRequiredScreen } from "@/features/layout/components/AuthRequiredScreen";
import { isAuthenticated } from "@/features/layout/lib/is-authenticated";

export const metadata: Metadata = {
    title: "الدفع | شيلة فود",
    description: "راجع تفاصيل طلبك واختر طريقة التوصيل والدفع",
};

function formatInvoiceAmount(amount: number) {
    return `${formatPrice(amount)} ﷼`;
}

async function buildCheckoutData({ isArabic }: { isArabic: boolean }): Promise<CheckoutData> {

    const [items, addresses, cookieStore] = await Promise.all([
        getCart({ isArabic }),
        getAddresses({ isArabic }),
        cookies(),
    ]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let contactName = "Shella User";
    let contactPhone = "";
    let walletBalance = "0.00";
    try {
        const raw = cookieStore.get(COOKIE_KEYS.USER)?.value;
        if (raw) {
            const user: AuthUser = JSON.parse(raw);
            contactName = `${user.f_name} ${user.l_name}`.trim() || contactName;
            contactPhone = user.phone || contactPhone;
            walletBalance = (user.wallet_balance ?? 0).toFixed(2);
        }
    } catch {
        // cookie parse failure — defaults are fine
    }

    const defaultAddress = addresses[0] ?? null;
    const deliveryAddress = defaultAddress
        ? formatAddressLine(defaultAddress, isArabic)
        : "";
    const deliveryAddressShort = defaultAddress?.address_label ?? "";
    const latitude = defaultAddress ? String(defaultAddress.latitude) : (process.env.NEXT_PUBLIC_LATITUDE ?? "24.7136");
    const longitude = defaultAddress ? String(defaultAddress.longitude) : (process.env.NEXT_PUBLIC_LONGITUDE ?? "46.6753");

    const walletFormatted = `${walletBalance} ﷼`;

    return {
        cartCount: items.length,
        cartItems: items.map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.image_full_url,
        })),
        deliveryMethod: "delivery",
        deliveryAddress,
        deliveryAddressShort,
        walletBalance: walletFormatted,
        myWalletBalance: walletFormatted,
        invoice: {
            subtotal: formatInvoiceAmount(subtotal),
            deliveryFee: formatInvoiceAmount(0),
            serviceFee: formatInvoiceAmount(0),
            discount: formatInvoiceAmount(0),
            total: formatInvoiceAmount(subtotal),
        },
        placeOrderPayload: {
            cart: items.map((item) => ({
                item_id: item.item_id,
                quantity: item.quantity,
                price: item.price,
            })),
            order_amount: subtotal,
            payment_method: "digital_payment",
            order_type: "delivery",
            // store_id is extracted by parseCartItems from item.store_id / item.item_details.store_id / cart.store_id
            store_id: items.find((i) => i.store_id)?.store_id ?? 0,
            distance: 1,
            address: deliveryAddress,
            longitude,
            latitude,
            contact_person_name: contactName,
            contact_person_number: contactPhone,
        },
    };
}

export default async function CheckoutPage() {
    const locale = await getServerLocale()
    const isArabic = locale === "ar";
    if (!(await isAuthenticated())) {
        return <AuthRequiredScreen page="checkout" />;
    }


    const checkoutData = await buildCheckoutData({ isArabic });

    return (
        <CheckoutShell checkoutData={checkoutData} isArabic={isArabic}>
            <Suspense fallback={<CartSummary.skeleton />}>
                <CartSummary isArabic={isArabic} />
            </Suspense>
            <Suspense fallback={<DeliveryMethod.skeleton />}>
                <DeliveryMethod isArabic={isArabic} />
            </Suspense>
            <Suspense fallback={<PaymentMethod.skeleton />}>
                <PaymentMethod isArabic={isArabic} />
            </Suspense>
            <Suspense fallback={<DiscountCode.skeleton />}>
                <DiscountCode isArabic={isArabic} />
            </Suspense>
            <Suspense fallback={<AdditionalNote.skeleton />}>
                <AdditionalNote isArabic={isArabic} />
            </Suspense>
            <Suspense fallback={<InvoiceDetails.skeleton />}>
                <InvoiceDetails isArabic={isArabic} />
            </Suspense>
        </CheckoutShell>
    );
}
