"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { SupportInfoCard } from "@/features/profile/components/shared/support/SupportInfoCard";
import { SUPPORT_STRINGS } from "@/features/profile/constants/support.strings";

const iconClass = "h-6 w-6 text-[#555555] dark:text-gray-400";

export function HelpSupportClient() {
    const router = useRouter();

    return (
        <ProfileSubpageShell
            title={SUPPORT_STRINGS.pageTitle}
            showHeaderBorder={false}
            relaxedHeader
            mainClassName="px-0"
        >
            <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 sm:max-w-2xl sm:gap-10 sm:px-5 lg:max-w-4xl lg:px-6">
                <Image
                    src="/favicon.ico"
                    alt={SUPPORT_STRINGS.logoAlt}
                    width={165}
                    height={118}
                    className="h-auto w-[140px] object-contain sm:w-[165px] md:w-[190px]"
                    priority
                />

                <div className="grid w-full grid-cols-1 gap-3 rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-900/50 sm:gap-4 sm:p-4 md:grid-cols-2">
                    <SupportInfoCard
                        icon={<MessageCircle className={iconClass} strokeWidth={1.5} />}
                        title={SUPPORT_STRINGS.liveChatTitle}
                        body={SUPPORT_STRINGS.liveChatSubtitle}
                        showChevron
                        align="center"
                        onClick={() => router.push("/profile/live-chat")}
                    />

                    <SupportInfoCard
                        icon={<MapPin className={iconClass} strokeWidth={1.5} />}
                        title={SUPPORT_STRINGS.addressTitle}
                        body={
                            <p className="whitespace-normal leading-[160%]">
                                {SUPPORT_STRINGS.addressBody}
                            </p>
                        }
                    />

                    <SupportInfoCard
                        icon={<Phone className={iconClass} strokeWidth={1.5} />}
                        title={SUPPORT_STRINGS.phoneTitle}
                        body={
                            <a
                                href={`tel:${SUPPORT_STRINGS.phoneNumber}`}
                                className="block text-right underline-offset-2 active:underline"
                                dir="ltr"
                            >
                                {SUPPORT_STRINGS.phoneNumber}
                            </a>
                        }
                    />

                    <SupportInfoCard
                        icon={<Mail className={iconClass} strokeWidth={1.5} />}
                        title={SUPPORT_STRINGS.emailTitle}
                        body={
                            <a
                                href={`mailto:${SUPPORT_STRINGS.emailAddress}`}
                                className="block text-right underline-offset-2 active:underline"
                                dir="ltr"
                            >
                                {SUPPORT_STRINGS.emailAddress}
                            </a>
                        }
                    />
                </div>
            </div>
        </ProfileSubpageShell>
    );
}
