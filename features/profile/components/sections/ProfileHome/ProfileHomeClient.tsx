"use client";

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
import { useState } from "react";
import type { AuthUser } from "@/features/auth/types/auth.types";
import { clearSession } from "@/features/auth/lib/auth.lib";
import { useBottomSheet } from "@/features/checkout/components/shared/useBottomSheet";
import { LogoutConfirmSheet } from "@/features/profile/components/modals/LogoutConfirmSheet";
import { QidhaSubscribeSheet } from "@/features/profile/components/modals/QidhaSubscribeSheet";
import { ProfileListRow } from "@/features/profile/components/shared/ProfileListRow";
import { ProfileSection } from "@/features/profile/components/shared/ProfileSection";
import { ProfileSwitch } from "@/features/profile/components/shared/ProfileSwitch";
import { ProfileAvatar } from "@/features/profile/components/shared/ProfileAvatar";
import { StatCard } from "@/features/profile/components/shared/StatCard";
import { LOCALE_LABELS, PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";


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
        if (!qidhaActive) qidhaSheet.open();
    };
    return (
        <>
            {/* Profile summary card */}
            <section className="mx-auto w-full max-w-[343px]">
                <div className="flex flex-col items-start gap-2 rounded-2xl bg-white py-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                    <div className="flex w-full items-center gap-2.5 px-4">
                        <ProfileAvatar
                            src={user.image}
                            alt={displayName}
                            size={60}
                            className="border border-[#F6F5F8]"
                        />
                        <button
                            type="button"
                            onClick={() => router.push("/profile/edit")}
                            className="flex min-w-0 flex-1 flex-col items-start gap-1 text-start"
                        >
                            <p className="w-full text-[16px] font-bold leading-[160%] text-[#111B18]">
                                {PROFILE_STRINGS.welcome(displayName || user.f_name)}
                            </p>
                            <span className="flex items-center gap-2 text-[16px] font-bold leading-[160%] text-[#111B18]">
                                <Settings className="h-6 w-6 shrink-0 text-[#30913F]" strokeWidth={2} />

                                {PROFILE_STRINGS.accountSettings}
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Stat cards */}
            <section className="mx-auto  flex h-[145px] flex-row-reverse w-full max-w-[343px] gap-2">
                <StatCard
                    variant="points"
                    title={PROFILE_STRINGS.yourPoints}
                    value={user.loyalty_point}
                />
                <StatCard
                    variant="wallet"
                    title={PROFILE_STRINGS.myWallet}
                    value={user.wallet_balance}
                    showCurrency
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
                <ProfileListRow
                    icon={<Moon strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.darkMode}
                    showChevron={false}
                    trailing={
                        <ProfileSwitch
                            checked={darkModeEnabled}
                            onChange={setDarkModeEnabled}
                            ariaLabel={PROFILE_STRINGS.darkMode}
                        />
                    }
                />
                <ProfileListRow
                    icon={<Bell strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.notifications}
                    showChevron={false}
                    trailing={
                        <ProfileSwitch
                            checked={notificationsEnabled}
                            onChange={setNotificationsEnabled}
                            ariaLabel={PROFILE_STRINGS.notifications}
                        />
                    }
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
                    onClick={() => { }}
                />
            </ProfileSection>

            <ProfileSection title={PROFILE_STRINGS.sectionLegal}>
                <ProfileListRow
                    icon={<Shield strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.privacy}
                    onClick={() => { }}
                />
                <ProfileListRow
                    icon={<FileText strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.terms}
                    onClick={() => { }}
                />
                <ProfileListRow
                    icon={<HelpCircle strokeWidth={1.5} />}
                    label={PROFILE_STRINGS.refundPolicy}
                    onClick={() => { }}
                />
            </ProfileSection>

            <section className="mx-auto w-full max-w-[343px] pb-2">
                <div className="rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                    <button
                        type="button"
                        onClick={logoutSheet.open}
                        className="flex w-full items-center justify-start gap-2 transition-opacity active:opacity-80"
                    >
                        <LogOut className="h-5 w-5 text-[#555555]" strokeWidth={1.5} />

                        <span className="text-[14px] font-bold leading-[160%] text-[#555555]">
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
