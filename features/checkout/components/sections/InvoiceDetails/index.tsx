import { MOCK_CHECKOUT } from "@/features/checkout/constants/checkout.constants";
import { InvoiceDetailsClient } from "./InvoiceDetailsClient";
import InvoiceDetailsSkeleton from "./skeleton";

export const InvoiceDetails = Object.assign(
    function InvoiceDetails() {
        return <InvoiceDetailsClient invoice={MOCK_CHECKOUT.invoice} />;
    },
    { skeleton: InvoiceDetailsSkeleton }
);
