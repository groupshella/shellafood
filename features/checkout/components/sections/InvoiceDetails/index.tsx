import { getCart } from "@/features/cart/api/cart";
import { formatPrice } from "@/features/home/components/shared/PriceTag";
import { InvoiceDetailsClient } from "./InvoiceDetailsClient";
import InvoiceDetailsSkeleton from "./skeleton";

function formatInvoiceAmount(amount: number) {
    return `${formatPrice(amount)} ﷼`;
}

export const InvoiceDetails = Object.assign(
    async function InvoiceDetails({ isArabic }: { isArabic: boolean }) {
        const items = await getCart({ isArabic });
        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        return (
            <InvoiceDetailsClient
                invoice={{
                    subtotal: formatInvoiceAmount(subtotal),
                    deliveryFee: formatInvoiceAmount(0),
                    serviceFee: formatInvoiceAmount(0),
                    discount: formatInvoiceAmount(0),
                    total: formatInvoiceAmount(subtotal),
                }}
                isArabic={isArabic}
            />
        );
    },
    { skeleton: InvoiceDetailsSkeleton }
);
