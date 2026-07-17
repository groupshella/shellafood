import {
	type WalletPaymentReturnStatus,
	WalletPaymentReturnClient,
} from "@/features/profile/components/sections/MyWallet/WalletPaymentReturnClient";
import { isArabicLocale } from "@/shared/lib/locale";

function resolveStatus(params: Record<string, string | string[] | undefined>): WalletPaymentReturnStatus {
	const values = [
		params.status,
		params.paymentStatus,
		params.payment_status,
		params.result,
		params.success,
		params.IsSuccess,
	]
		.flatMap((value) => (Array.isArray(value) ? value : value ? [value] : []))
		.map((value) => value.toLowerCase());

	if (
		values.some((value) =>
			["failure", "failed", "cancelled", "canceled", "false", "0", "error"].includes(value),
		) ||
		params.Error ||
		params.error
	) {
		return "failure";
	}
	// Query-string success flags are not proof of settlement. Until the backend
	// exposes a signed status endpoint, keep the top-up pending to avoid false credit.
	return "pending";
}

export default async function WalletPaymentReturnPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const [params, isArabic] = await Promise.all([searchParams, isArabicLocale()]);
	return <WalletPaymentReturnClient isArabic={isArabic} status={resolveStatus(params)} />;
}
