import Image from "next/image";

export function ReferralIllustration() {
    return (
        <div
            className="mx-auto flex h-[210px] w-[241px] items-center justify-center"
            aria-hidden
        >
            <Image
                src="/profile/referral-hands.png"
                alt=""
                width={203}
                height={210}
                className="h-[210px] w-[203px] object-contain"
                priority
            />
        </div>
    );
}
