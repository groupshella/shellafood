import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";

const STEPS = [REFERRAL_STRINGS.step1, REFERRAL_STRINGS.step2, REFERRAL_STRINGS.step3];

export function ReferralHowItWorksCard() {
    return (
        <div className="flex w-full flex-col items-start gap-2 rounded-lg bg-[#EBFEEB] p-2">
            <h3 className="w-full text-start text-[16px] font-bold leading-none text-[#111B18]">
                {REFERRAL_STRINGS.howItWorksTitle}
            </h3>
            {STEPS.map((step) => (
                <p
                    key={step}
                    className="w-full text-start text-[16px] font-bold leading-[160%] text-[#111B18]"
                >
                    {step}
                </p>
            ))}
        </div>
    );
}
