export function EmptyFavorites() {
    return (
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
            {/* Illustration */}
            <div className="relative mb-6 flex h-[160px] w-[160px] items-center justify-center">
                {/* Outer green blob */}
                <div className="absolute inset-0 rounded-[40%_60%_55%_45%/45%_55%_60%_40%] bg-[#E5FCE7] opacity-80" />
                {/* Inner blob */}
                <div className="absolute inset-4 rounded-[55%_45%_40%_60%/60%_40%_45%_55%] bg-[#DCFEDC] opacity-90" />

                {/* Illustrated SVG composition */}
                <svg
                    width="96"
                    height="96"
                    viewBox="0 0 96 96"
                    fill="none"
                    aria-hidden="true"
                    className="relative z-10"
                >
                    {/* Shopping basket body */}
                    <rect
                        x="18"
                        y="46"
                        width="60"
                        height="36"
                        rx="8"
                        fill="#A0E9AC"
                        opacity="0.6"
                    />
                    {/* Basket handle left */}
                    <path
                        d="M30 46 Q24 30 36 24"
                        stroke="#6AC47A"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Basket handle right */}
                    <path
                        d="M66 46 Q72 30 60 24"
                        stroke="#6AC47A"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                    {/* Receipt/list shape */}
                    <rect
                        x="28"
                        y="52"
                        width="40"
                        height="24"
                        rx="4"
                        fill="white"
                        opacity="0.85"
                    />
                    {/* Receipt lines */}
                    <line
                        x1="34"
                        y1="60"
                        x2="62"
                        y2="60"
                        stroke="#A8F1A9"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    <line
                        x1="34"
                        y1="67"
                        x2="56"
                        y2="67"
                        stroke="#A8F1A9"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    />
                    {/* Dashed heart outline centered above */}
                    <path
                        d="M48 36 C48 36 38 28 38 22 C38 18 42 16 45 18 C46 18.5 47 20 48 21 C49 20 50 18.5 51 18 C54 16 58 18 58 22 C58 28 48 36 48 36Z"
                        stroke="#42D15A"
                        strokeWidth="2"
                        strokeDasharray="3 2"
                        fill="#DCFEDC"
                        opacity="0.9"
                    />
                    {/* Small decorative heart dots */}
                    <circle cx="22" cy="36" r="3" fill="#6FCF80" opacity="0.6" />
                    <circle cx="74" cy="42" r="2" fill="#42D15A" opacity="0.5" />
                    <circle cx="20" cy="58" r="1.5" fill="#A8F1A9" opacity="0.7" />
                </svg>
            </div>

            <p className="text-[16px] font-bold text-[#111B18]">لا توجد مفضلات حتى الآن</p>
        </div>
    );
}
