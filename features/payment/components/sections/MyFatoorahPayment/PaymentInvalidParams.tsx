"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

export function PaymentInvalidParams() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm">
            <AlertCircle className="h-14 w-14 text-red-500" strokeWidth={1.5} />
            <h2 className="text-[17px] font-bold text-red-600">بيانات الدفع غير صالحة</h2>
            <p className="text-[13px] leading-relaxed text-gray-600">
                رقم الطلب أو المبلغ غير صحيح. يرجى العودة لصفحة الدفع وإعادة المحاولة.
            </p>
            <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="mt-3 w-full rounded-xl bg-[#30913F] py-3.5 text-[14px] font-semibold text-white transition-colors active:bg-[#267332]"
            >
                العودة للدفع
            </button>
        </div>
    );
}
