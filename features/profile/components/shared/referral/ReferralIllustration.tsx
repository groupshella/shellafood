import Image from "next/image";

export function ReferralIllustration() {
    return (
        <div
            className="mx-auto flex aspect-[241/210] w-full max-w-[241px] items-center justify-center sm:max-w-[280px] md:max-w-[320px]"
            aria-hidden
        >
            <Image
                src="/profile/referral-hands.png"
                alt=""
                width={203}
                height={210}
                className="h-full w-auto object-contain"
                priority
            />
        </div>
    );
}
