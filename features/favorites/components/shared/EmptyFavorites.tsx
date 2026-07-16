interface EmptyFavoritesProps {
    isArabic: boolean;
}

export function EmptyFavorites({ isArabic }: EmptyFavoritesProps) {
    return (
        <div
            className="flex flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16 md:px-8 lg:py-24"
            dir={isArabic ? "rtl" : "ltr"}
            lang={isArabic ? "ar" : "en"}
        >
            <div className="relative mb-5 flex h-32 w-32 items-center justify-center sm:mb-6 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-44 lg:w-44">
                {/* Illustration accents — decorative, not UI chrome tokens */}
                <div className="absolute inset-0 rounded-[40%_60%_55%_45%/45%_55%_60%_40%] bg-[#E5FCE7] opacity-80 dark:bg-[#0d2e12] dark:opacity-70" />
                <div className="absolute inset-4 rounded-[55%_45%_40%_60%/60%_40%_45%_55%] bg-[#DCFEDC] opacity-90 dark:bg-[#163d1c]" />

                <svg
                    viewBox="0 0 96 96"
                    fill="none"
                    aria-hidden="true"
                    className="relative z-10 h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28"
                >
                    <rect x="18" y="46" width="60" height="36" rx="8" fill="#A0E9AC" opacity="0.6" />
                    <path d="M30 46 Q24 30 36 24" stroke="#6AC47A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                    <path d="M66 46 Q72 30 60 24" stroke="#6AC47A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                    <rect x="28" y="52" width="40" height="24" rx="4" fill="white" opacity="0.85" />
                    <line x1="34" y1="60" x2="62" y2="60" stroke="#A8F1A9" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="34" y1="67" x2="56" y2="67" stroke="#A8F1A9" strokeWidth="2.5" strokeLinecap="round" />
                    <path
                        d="M48 36 C48 36 38 28 38 22 C38 18 42 16 45 18 C46 18.5 47 20 48 21 C49 20 50 18.5 51 18 C54 16 58 18 58 22 C58 28 48 36 48 36Z"
                        stroke="#42D15A"
                        strokeWidth="2"
                        strokeDasharray="3 2"
                        fill="#DCFEDC"
                        opacity="0.9"
                    />
                    <circle cx="22" cy="36" r="3" fill="#6FCF80" opacity="0.6" />
                    <circle cx="74" cy="42" r="2" fill="#42D15A" opacity="0.5" />
                    <circle cx="20" cy="58" r="1.5" fill="#A8F1A9" opacity="0.7" />
                </svg>
            </div>

            <p className="text-base font-bold text-foreground sm:text-lg">
                {isArabic ? "لا توجد مفضلات حتى الآن" : "No favorites yet"}
            </p>
            <p className="mt-1.5 max-w-[220px] text-sm text-muted sm:mt-2 sm:max-w-xs sm:text-[15px] md:max-w-sm">
                {isArabic
                    ? "ابدأ بإضافة المنتجات أو المتاجر التي تعجبك"
                    : "Start by adding products or stores you like"}
            </p>
        </div>
    );
}
