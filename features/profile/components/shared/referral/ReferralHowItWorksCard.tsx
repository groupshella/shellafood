import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";

const STEPS = [REFERRAL_STRINGS.step1, REFERRAL_STRINGS.step2, REFERRAL_STRINGS.step3];

export function ReferralHowItWorksCard() {
    return (
        <div className="grid w-full grid-cols-1 items-start gap-2 rounded-xl bg-[#EBFEEB] p-3 dark:bg-[#30913F]/10 sm:p-4 md:grid-cols-3 md:gap-4">
            <h3 className="w-full text-start text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 md:col-span-3">
                {REFERRAL_STRINGS.howItWorksTitle}
            </h3>
            {STEPS.map((step) => (
                <p
                    key={step}
                    className="w-full rounded-lg bg-white/45 p-2 text-start text-[15px] font-bold leading-[160%] text-[#111B18] dark:bg-gray-900/25 dark:text-gray-200 sm:text-[16px]"
                >
                    {step}
                </p>
            ))}
        </div>
    );
}
