"use client";

import { MapPin } from "lucide-react";

interface OutOfServiceAreaProps {
    onAutoRedirect: () => void;
    onGoHome: () => void;
}

export function OutOfServiceArea({
    onAutoRedirect,
    onGoHome,
}: OutOfServiceAreaProps) {
    return (
        <div
            dir="rtl"
            role="alertdialog"
            aria-labelledby="out-of-zone-title"
            aria-describedby="out-of-zone-desc"
            className="mx-auto flex w-full max-w-sm flex-col items-center px-4 pb-6 pt-10 text-center sm:px-5"
        >
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
                <span className="absolute inset-0 rounded-full border border-dashed border-[#E5E5E5]" />
                <span className="absolute inset-3 rounded-full border border-dashed border-[#E5E5E5]" />

                <MapPin
                    className="relative h-12 w-12 text-[#E5E5E5] sm:h-14 sm:w-14"
                    strokeWidth={1.5}
                    fill="#F6F6F6"
                />
                <span className="absolute top-7 flex h-5 w-5 items-center justify-center rounded-full bg-white sm:top-8">
                    <svg
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5 text-[#9CA3AF]"
                        fill="none"
                        aria-hidden
                    >
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                        <path
                            d="M7 7l6 6M13 7l-6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>

                <span className="absolute bottom-3 h-2.5 w-16 rounded-full bg-[#F0F0F0]" />
            </div>

            <h2
                id="out-of-zone-title"
                className="text-[16px] font-bold leading-snug text-[#111B18]"
            >
                هذه المنطقة خارج نطاق خدمتنا
            </h2>
            <p
                id="out-of-zone-desc"
                className="mt-2 text-[14px] leading-relaxed text-[#43474F]"
            >
                هل ترغب بالتوجه تلقائياً إلى أقرب منطقة متوفر فيها الخدمة؟
            </p>

            <div className="mt-6 flex w-full flex-col gap-3">
                <button
                    type="button"
                    onClick={onAutoRedirect}
                    className="h-12 w-full rounded-xl bg-[#30913F] text-[15px] font-bold text-white transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2"
                >
                    نعم ، وجههني
                </button>
                <button
                    type="button"
                    onClick={onGoHome}
                    className="h-12 w-full rounded-xl bg-[#F6F6F6] text-[15px] font-bold text-[#43474F] transition-colors hover:bg-[#ECECEC] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                >
                    لا ، الرجوع الرئيسية
                </button>
            </div>
        </div>
    );
}
