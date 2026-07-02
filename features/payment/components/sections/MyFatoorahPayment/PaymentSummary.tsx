// features/payment/components/sections/MyFatoorahPayment/PaymentSummary.tsx
interface PaymentSummaryProps {
    amount: number;
    currency: string;
    sessionExpiry?: string;
    language?: "AR" | "EN";
}

function formatSessionExpiry(expiry: string): string | null {
    const date = new Date(expiry);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
}

export function PaymentSummary({ amount, currency, sessionExpiry, language = "AR" }: PaymentSummaryProps) {
    const expiryLabel = sessionExpiry ? formatSessionExpiry(sessionExpiry) : null;

    return (
        <div className="mb-5 flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-sm">
            <span className="text-[13px] text-gray-500">المبلغ الإجمالي</span>
            <span className="mt-1 text-[30px] font-extrabold text-[#30913F]">
                {amount.toFixed(2)} <span className="text-[16px] font-semibold">{currency}</span>
            </span>
            <span className="mt-1 text-[12px] font-bold text-gray-700">Shella</span>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                <span>{language === "AR" ? "العربية" : "English"}</span>
                {expiryLabel && <span>· صالحة حتى {expiryLabel}</span>}
            </div>
        </div>
    );
}
