"use client";

import React from "react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { clearSession } from "@/features/auth/lib/auth.lib";
import { useBottomSheet } from "@/features/checkout/components/shared/useBottomSheet";
import { LogoutConfirmSheet } from "@/features/profile/components/modals/LogoutConfirmSheet";
import { QidhaSubscribeSheet } from "@/features/profile/components/modals/QidhaSubscribeSheet";
import { ProfileListRow } from "@/features/profile/components/shared/ProfileListRow";
import { ProfileSection } from "@/features/profile/components/shared/ProfileSection";
import { ProfileAvatar } from "@/features/profile/components/shared/ProfileAvatar";
import { StatCard } from "@/features/profile/components/shared/StatCard";
import { JoinStatusBadge } from "@/features/profile/components/shared/JoinStatusBadge";
import type { ProfileJoinStatuses } from "@/features/profile/types/join.types";
import {
    applyDarkMode,
    readDarkModePreference,
    setDarkModePreference,
} from "@/shared/lib/dark-mode";
import {
    ProfileAboutIcon,
    ProfileAddressIcon,
    ProfileCouponsIcon,
    ProfileDarkModeIcon,
    ProfileDriverIcon,
    ProfileLanguageIcon,
    ProfileLiveChatIcon,
    ProfileLogoutIcon,
    ProfileNotificationsIcon,
    ProfilePrivacyIcon,
    ProfileReferralIcon,
    ProfileRefundIcon,
    ProfileStatisticsIcon,
    ProfileSupportIcon,
    ProfileTermsIcon,
    ProfileVoucherRepIcon,
} from "./ProfileHomeIcons";

interface ToggleRowProps {
    icon: React.ReactNode;
    label: string;
    checked: boolean;
    onChange: (next: boolean) => void;
}

function ToggleRow({ icon, label, checked, onChange }: ToggleRowProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className="flex min-h-[48px] w-full items-center justify-between gap-3 px-3 transition-colors active:bg-[#F6F5F8]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#30913F]/40 dark:active:bg-gray-700/60 sm:min-h-[52px] sm:gap-4 sm:px-4"
        >
            <div className="flex min-w-0 flex-1 flex-row-reverse items-center justify-end gap-2 sm:gap-2.5">
                <span className="truncate text-[15px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[16px]">
                    {label}
                </span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[#555555] dark:text-gray-400 sm:h-7 sm:w-7 [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-6 sm:[&>svg]:w-6">
                    {icon}
                </span>
            </div>

            <div
                aria-hidden
                className={[
                    "relative h-[25px] w-[50px] shrink-0 rounded-[32px] transition-colors duration-200",
                    checked ? "bg-[#30913F]" : "bg-[#D1D5DB] dark:bg-gray-600",
                ].join(" ")}
            >
                <span
                    className={[
                        "absolute top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200",
                        checked ? "start-[26.5px]" : "start-[2px]",
                    ].join(" ")}
                />
            </div>
        </button>
    );
}

interface ProfileHomeClientProps {
    user: AuthUser;
    joinStatuses: ProfileJoinStatuses;
}

export function ProfileHomeClient({ user, joinStatuses }: ProfileHomeClientProps) {
    const router = useRouter();
    const logoutSheet = useBottomSheet();
    const qidhaSheet = useBottomSheet();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const displayName = `${user.f_name} ${user.l_name}`.trim();
    const qidhaActive = user.qidha_wallet_active ?? false;
    const qidhaBalance = user.qidha_wallet_balance ?? 0;

    useEffect(() => {
        const stored = readDarkModePreference();
        setDarkModeEnabled(stored);
        applyDarkMode(stored);
    }, []);

    const handleDarkModeChange = (checked: boolean) => {
        setDarkModeEnabled(checked);
        setDarkModePreference(checked);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await clearSession();
            logoutSheet.close();
            router.replace("/auth");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleQidhaTap = () => {
        qidhaSheet.open();
    };

    return (
        <>
            <section className="mx-auto w-full">
                <div className="flex flex-col items-start gap-2 rounded-2xl bg-white py-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:py-5">
                    <div className="flex w-full items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-6">
                        <ProfileAvatar
                            src={user.image}
                            alt={displayName}
                            size={60}
                            className="border border-[#F6F5F8] dark:border-gray-700"
                        />
                        <Link
                            href="/profile/edit"
                            className="flex min-w-0 flex-1 flex-col items-start gap-1 text-start"
                        >
                            <p className="w-full text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[17px] lg:text-lg">
                                أهلاً {displayName || user.f_name}
                            </p>
                            <span className="flex items-center gap-2 text-[15px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[16px]">
                                <Settings
                                    className="h-5 w-5 shrink-0 text-[#30913F] sm:h-6 sm:w-6"
                                    strokeWidth={2}
                                />
                                إعدادات الحساب
                            </span>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto mb-4 grid w-full max-w-sm grid-cols-3 items-stretch justify-items-center gap-2 overflow-visible sm:gap-3 md:max-w-xl md:gap-4">
                <StatCard
                    variant="points"
                    title="نقاطك"
                    value={user.loyalty_point}
                    href="/profile/points"
                />
                <StatCard
                    variant="wallet"
                    title="محفظتي"
                    value={user.wallet_balance}
                    showCurrency
                    href="/profile/wallet"
                />
                <StatCard
                    variant="qidha"
                    title="محفظة قيدها"
                    value={qidhaActive ? qidhaBalance : 0}
                    showCurrency
                    href={qidhaActive ? "/profile/qidha" : undefined}
                    onClick={qidhaActive ? undefined : handleQidhaTap}
                />
            </section>

            <ProfileSection title="حسابي">
                <ProfileListRow
                    icon={<ProfileAddressIcon />}
                    label="عناوين التوصيل"
                    href="/addresses"
                />
                <ProfileListRow
                    icon={<ProfileLanguageIcon />}
                    label="اللغة"
                    subLabel="العربية (المملكة العربية السعودية)"
                    href="/profile/language"
                />
                <ToggleRow
                    icon={<ProfileDarkModeIcon />}
                    label="تفعيل الوضع الداكن"
                    checked={darkModeEnabled}
                    onChange={handleDarkModeChange}
                />
                <ToggleRow
                    icon={<ProfileNotificationsIcon />}
                    label="الإشعارات"
                    checked={notificationsEnabled}
                    onChange={setNotificationsEnabled}
                />
            </ProfileSection>

            <ProfileSection title="النشاط الترويجي والأرباح">
                <ProfileListRow
                    icon={<ProfileCouponsIcon />}
                    label="الكوبونات"
                    href="/coupons"
                />
                <ProfileListRow
                    icon={<ProfileStatisticsIcon />}
                    label="إحصائيات"
                    href="/profile/statistics"
                />
                <ProfileListRow
                    icon={<ProfileReferralIcon />}
                    label="اكسب مع مشاركة الأصدقاء"
                    href="/profile/referral"
                />
                <ProfileListRow
                    icon={<ProfileDriverIcon />}
                    label="انضم كرجل توصيل"
                    href="/profile/join-driver"
                    trailing={<JoinStatusBadge status={joinStatuses.driver} />}
                />
                <ProfileListRow
                    icon={<ProfileVoucherRepIcon />}
                    label="مندوب تسويق قسائم شرائية"
                    href="/profile/join-voucher-rep"
                    trailing={<JoinStatusBadge status={joinStatuses.delegate} />}
                />
            </ProfileSection>

            <ProfileSection title="المساعدة والدعم">
                <ProfileListRow
                    icon={<ProfileLiveChatIcon />}
                    label="الدردشة الحية"
                    href="/profile/live-chat"
                />
                <ProfileListRow
                    icon={<ProfileSupportIcon />}
                    label="المساعدة والدعم الفني"
                    href="/profile/help-support"
                />
                <ProfileListRow
                    icon={<ProfileAboutIcon />}
                    label="معلومات عنا"
                    href="/profile/about-us"
                />
            </ProfileSection>

            <ProfileSection title="المستندات القانونية">
                <ProfileListRow
                    icon={<ProfilePrivacyIcon />}
                    label="الخصوصية"
                    href="/profile/privacy-policy"
                />
                <ProfileListRow
                    icon={<ProfileTermsIcon />}
                    label="الشروط والأحكام"
                    href="/profile/terms-and-conditions"
                />
                <ProfileListRow
                    icon={<ProfileRefundIcon />}
                    label="سياسة استرداد الأموال"
                    href="/profile/refund-policy"
                />
            </ProfileSection>

            <section className="mx-auto w-full pb-2">
                <div className="rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)]">
                    <button
                        type="button"
                        onClick={logoutSheet.open}
                        className="flex min-h-[44px] w-full items-center justify-start gap-2 transition-opacity active:opacity-80"
                    >
                        <ProfileLogoutIcon className="h-5 w-5 text-[#555555] dark:text-gray-400" />
                        <span className="text-[14px] font-bold leading-[160%] text-[#555555] dark:text-gray-400">
                            تسجيل الخروج
                        </span>
                    </button>
                </div>
            </section>

            <LogoutConfirmSheet
                isOpen={logoutSheet.isOpen}
                isVisible={logoutSheet.isVisible}
                onClose={logoutSheet.close}
                onConfirm={handleLogout}
                isLoading={isLoggingOut}
            />

            <QidhaSubscribeSheet
                isOpen={qidhaSheet.isOpen}
                isVisible={qidhaSheet.isVisible}
                onClose={qidhaSheet.close}
            />
        </>
    );
}
