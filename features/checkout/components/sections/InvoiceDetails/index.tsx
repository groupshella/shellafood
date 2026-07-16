import { InvoiceDetailsClient } from "./InvoiceDetailsClient";
import InvoiceDetailsSkeleton from "./skeleton";

export const InvoiceDetails = Object.assign(
	function InvoiceDetails({ isArabic }: { isArabic: boolean }) {
		return <InvoiceDetailsClient isArabic={isArabic} />;
	},
	{ skeleton: InvoiceDetailsSkeleton },
);
