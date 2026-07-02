// features/payment/components/sections/MyFatoorahPayment/PaymentStatusView.tsx
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { PaymentScreenStatus } from "@/features/payment/types/payment.types";

interface PaymentStatusViewProps {
    status: Extract<PaymentScreenStatus, "success" | "pending" | "failed">;
    onRetry: () => void;
    onViewOrder?: () => void;
}

const CONTENT: Record<
    PaymentStatusViewProps["status"],
    { icon: React.ReactNode; title: string; subtitle: string; color: string }
> = {
    success: {
        icon: <CheckCircle2 className="h-14 w-14 text-[#30913F]" strokeWidth={1.5} />,
        title: "تم الدفع بنجاح",
        subtitle: "تم تأكيد طلبك وسيتم تجهيزه الآن",
        color: "text-[#30913F]",
    },
    pending: {
        icon: <Clock className="h-14 w-14 text-amber-500" strokeWidth={1.5} />,
        title: "الدفع قيد المراجعة",
        subtitle: "سيتم تأكيد حالة الدفع خلال لحظات، يمكنك متابعة الطلب من صفحة طلباتي",
        color: "text-amber-600",
    },
    failed: {
        icon: <XCircle className="h-14 w-14 text-red-500" strokeWidth={1.5} />,
        title: "فشلت عملية الدفع",
        subtitle: "لم تكتمل عملية الدفع، يمكنك المحاولة مرة أخرى",
        color: "text-red-600",
    },
};

export function PaymentStatusView({ status, onRetry, onViewOrder }: PaymentStatusViewProps) {
    const content = CONTENT[status];

    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm">
            {content.icon}
            <h2 className={`text-[17px] font-bold ${content.color}`}>{content.title}</h2>
            <p className="text-[13px] leading-relaxed text-gray-600">{content.subtitle}</p>

            {status === "failed" && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                >
                    إعادة المحاولة
                </button>
            )}

            {status !== "failed" && onViewOrder && (
                <button
                    type="button"
                    onClick={onViewOrder}
                    className="mt-3 w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
                >
                    عرض تفاصيل الطلب
                </button>
            )}
        </div>
    );
}
