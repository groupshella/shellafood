"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { SupportInfoCard } from "@/features/profile/components/shared/support/SupportInfoCard";
import { SUPPORT_STRINGS } from "@/features/profile/constants/support.strings";

const iconClass = "h-6 w-6 text-[#555555]";

export function HelpSupportClient() {
    const router = useRouter();

    return (
        <ProfileSubpageShell
            title={SUPPORT_STRINGS.pageTitle}
            showHeaderBorder={false}
            relaxedHeader
            mainClassName="px-0"
        >
            <div className="flex flex-col items-center gap-12">
                <Image
                    src="/favicon.ico"
                    alt={SUPPORT_STRINGS.logoAlt}
                    width={165}
                    height={118}
                    className="h-[118px] w-[165px] object-contain"
                    priority
                />

                <div className="flex w-full flex-col gap-4 rounded-2xl bg-[#F6F5F8] p-4">
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
