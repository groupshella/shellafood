import Image from "next/image";

import { REFERRAL_STRINGS } from "@/features/profile/constants/referral.strings";

export function ReferralInvitedEmpty() {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 pt-8 sm:pt-10">
            <div className="flex aspect-[241/210] w-full max-w-[241px] items-center justify-center sm:max-w-[280px]" aria-hidden>
                <Image
                    src="/profile/invited-friends-empty.png"
                    alt=""
                    width={241}
                    height={210}
                    className="h-full w-full object-contain"
                />
            </div>

            <p className="max-w-md text-center text-[17px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[18px]">
                {REFERRAL_STRINGS.emptyInvitedFriends}
            </p>
        </div>
    );
}
