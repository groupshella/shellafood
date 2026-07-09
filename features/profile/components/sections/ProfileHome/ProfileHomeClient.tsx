"use client";

import React from "react";
import {
    BarChart3,
    Bell,
    FileText,
    Globe,
    Headphones,
    HelpCircle,
    Info,
    LogOut,
    MapPin,
    MessageCircle,
    Moon,
    RefreshCw,
    Settings,
    Shield,
    Tag,
    Truck,
    UserPlus,
    Users,
} from "lucide-react";
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
import { LOCALE_LABELS, PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import {
    applyDarkMode,
    readDarkModePreference,
    setDarkModePreference,
} from "@/shared/lib/dark-mode";

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
}

export function ProfileHomeClient({ user }: ProfileHomeClientProps) {
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
        if (qidhaActive) {
            router.push("/profile/qidha");
            return;
        }
        qidhaSheet.open();
    };

    return (
        <>
            {/* Profile summary card */}
            <section className="mx-auto w-full">
                <div className="flex flex-col items-start gap-2 rounded-2xl bg-white py-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:py-5">
                    <div className="flex w-full items-center gap-3 px-3 sm:gap-4 sm:px-5 lg:px-6">
                        <ProfileAvatar
                            src={user.image}
                            alt={displayName}
                            size={60}
                            className="border border-[#F6F5F8] dark:border-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => router.push("/profile/edit")}
                            className="flex min-w-0 flex-1 flex-col items-start gap-1 text-start"
                        >
                            <p className="w-full text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[17px] lg:text-lg">
                                {PROFILE_STRINGS.welcome(displayName || user.f_name)}
                            </p>
                            <span className="flex items-center gap-2 text-[15px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[16px]">
                                <Settings className="h-5 w-5 shrink-0 text-[#30913F] sm:h-6 sm:w-6" strokeWidth={2} />
                                {PROFILE_STRINGS.accountSettings}
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Stat cards */}
            <section className="mx-auto mb-4 grid w-full max-w-sm grid-cols-3 items-stretch justify-items-center gap-2 overflow-visible sm:gap-3 md:max-w-xl md:gap-4">
                <StatCard
                    variant="points"
                    title={PROFILE_STRINGS.yourPoints}
                    value={user.loyalty_point}
                    onClick={() => router.push("/profile/points")}
                />
                <StatCard
                    variant="wallet"
                    title={PROFILE_STRINGS.myWallet}
                    value={user.wallet_balance}
                    showCurrency
                    onClick={() => router.push("/profile/wallet")}
                />
                <StatCard
                    variant="qidha"
                    title={PROFILE_STRINGS.qidhaWallet}
                    value={qidhaActive ? qidhaBalance : 0}
                    showCurrency
                    onClick={handleQidhaTap}
                />
            </section>

            <ProfileSection title={PROFILE_STRINGS.sectionMyAccount}>
                <ProfileListRow
                    icon={<MapPin strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.deliveryAddresses}
                    onClick={() => router.push("/addresses")}
                />
                <ProfileListRow
                    icon={<Globe strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.language}
                    subLabel={LOCALE_LABELS["ar"]}
                    onClick={() => router.push("/profile/language")}
                />
                <ToggleRow
                    icon={<Moon strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.darkMode}
                    checked={darkModeEnabled}
                    onChange={handleDarkModeChange}
                />
                <ToggleRow
                    icon={<Bell strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.notifications}
                    checked={notificationsEnabled}
                    onChange={setNotificationsEnabled}
                />
            </ProfileSection>

            <ProfileSection title={PROFILE_STRINGS.sectionPromo}>
                <ProfileListRow
                    icon={<Tag strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.coupons}
                    onClick={() => router.push("/coupons")}
                />
                <ProfileListRow
                    icon={<BarChart3 strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.statistics}
                    onClick={() => router.push("/profile/statistics")}
                />
                <ProfileListRow
                    icon={<Users strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.earnWithFriends}
                    onClick={() => router.push("/profile/referral")}
                />
                <ProfileListRow
                    icon={<Truck strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.joinAsDriver}
                    onClick={() => router.push("/profile/join-driver")}
                />
                <ProfileListRow
                    icon={<UserPlus strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.voucherRep}
                    onClick={() => router.push("/profile/join-voucher-rep")}
                />
            </ProfileSection>

            <ProfileSection title={PROFILE_STRINGS.sectionHelp}>
                <ProfileListRow
                    icon={<MessageCircle strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.liveChat}
                    onClick={() => router.push("/profile/live-chat")}
                />
                <ProfileListRow
                    icon={<Headphones strokeWidth={1.25} />}
                    label={PROFILE_STRINGS.technicalSupport}
                    onClick={() => router.push("/profile/help-support")}
                />
                <ProfileListRow
                    icon={<RefreshCw strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.checkUpdates}
                    onClick={() => { }}
                />
                <ProfileListRow
                    icon={<Info strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.aboutUs}
                    onClick={() => router.push("/profile/about-us")}
                />
            </ProfileSection>

            <ProfileSection title={PROFILE_STRINGS.sectionLegal}>
                <ProfileListRow
                    icon={<Shield strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.privacy}
                    onClick={() => router.push("/profile/privacy-policy")}
                />
                <ProfileListRow
                    icon={<FileText strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.terms}
                    onClick={() => router.push("/profile/terms-and-conditions")}
                />
                <ProfileListRow
                    icon={<HelpCircle strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.refundPolicy}
                    onClick={() => router.push("/profile/refund-policy")}
                />
            </ProfileSection>

            <section className="mx-auto w-full pb-2">
                <div className="rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-800 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)]">
                    <button
                        type="button"
                        onClick={logoutSheet.open}
                        className="flex min-h-[44px] w-full items-center justify-start gap-2 transition-opacity active:opacity-80"
                    >
                        <LogOut className="h-5 w-5 text-[#555555] dark:text-gray-400" strokeWidth={1.5} />
                        <span className="text-[14px] font-bold leading-[160%] text-[#555555] dark:text-gray-400">
                            {PROFILE_STRINGS.logout}
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
