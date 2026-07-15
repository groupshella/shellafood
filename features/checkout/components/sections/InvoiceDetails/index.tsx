import { InvoiceDetailsClient } from "./InvoiceDetailsClient";
import InvoiceDetailsSkeleton from "./skeleton";

export const InvoiceDetails = Object.assign(
    function InvoiceDetails() {
        return <InvoiceDetailsClient />;
    },
    { skeleton: InvoiceDetailsSkeleton }
);
