import { useLanguage } from "@/features/language/useLanguage";

const STEPS = [
    { ar: "1- قم بدعوة أصدقائك والشركات", en: "1- Invite your friends and businesses" },
    { ar: "2- يقومون بالتسجيل في شلة مع عرض خاص", en: "2- They register in Shella with a special offer" },
    { ar: "3- لقد حققت مكاسبك !", en: "3- You earned your rewards!" },
];

export function ReferralHowItWorksCard() {
    const { isArabic } = useLanguage();

    return (
        <div className="grid w-full grid-cols-1 items-start gap-2 rounded-xl bg-[#EBFEEB] p-3 dark:bg-[#30913F]/10 sm:p-4 md:grid-cols-3 md:gap-4">
            <h3 className="w-full text-start text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 md:col-span-3">
                {isArabic ? "كيف يعمل ؟" : "How does it work?"}
            </h3>
            {STEPS.map((step) => (
                <p
                    key={step.ar}
                    className="w-full rounded-lg bg-white/45 p-2 text-start text-[15px] font-bold leading-[160%] text-[#111B18] dark:bg-gray-900/25 dark:text-gray-200 sm:text-[16px]"
                >
                    {isArabic ? step.ar : step.en}
                </p>
            ))}
        </div>
    );
}
