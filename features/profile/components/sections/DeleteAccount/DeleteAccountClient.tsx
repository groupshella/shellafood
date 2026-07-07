"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/features/auth/lib/auth.lib";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { PROFILE_STRINGS } from "@/features/profile/constants/profile.strings";
import { deleteAccount } from "@/features/profile/actions/profile.actions";

export function DeleteAccountClient() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!agreed) return;

        setIsDeleting(true);
        setError(null);

        const result = await deleteAccount();
        setIsDeleting(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        await clearSession();
        router.replace("/auth");
    };

    const canDelete = agreed && !isDeleting;

    return (
        <ProfileSubpageShell
            title={PROFILE_STRINGS.deleteTitle}
            relaxedHeader
            showHeaderBorder={false}
            showFooterBorder={false}
            footerClassName="pb-6 pt-4"
            mainClassName="pb-6"
            footer={
                <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:max-w-2xl lg:max-w-3xl">
                    <label className="flex cursor-pointer items-center justify-start gap-2">
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={agreed}
                            onClick={() => setAgreed((prev) => !prev)}
                            className={[
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border-[1.5px] transition-colors",
                                agreed
                                    ? "border-[#30913F] bg-[#30913F] text-white"
                                    : "border-[#555555] bg-white dark:border-gray-500 dark:bg-gray-800",
                            ].join(" ")}
                        >
                            {agreed && <span className="text-[13px] leading-none">✓</span>}
                        </button>
                        <span className="text-[14px] font-medium leading-[160%] text-[#555555] dark:text-gray-400">
                            {PROFILE_STRINGS.deleteAgree}
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={!canDelete}
                        className={[
                            "flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 text-[16px] font-bold leading-[160%] transition-colors sm:min-h-[52px]",
                            canDelete
                                ? "bg-[#EB4335] text-white active:bg-[#d63a2e]"
                                : "cursor-not-allowed bg-[#E2E4E6] text-[#555555] dark:bg-gray-800 dark:text-gray-500",
                        ].join(" ")}
                    >
                        {PROFILE_STRINGS.deleteAccount}
                    </button>
                </div>
            }
        >
            <div className="mx-auto flex w-full max-w-lg flex-col gap-4 sm:max-w-2xl lg:max-w-3xl lg:gap-5">
                <div className="flex flex-col items-start gap-1">
                    <p className="w-full text-start text-[16px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100 sm:text-[17px]">
                        {PROFILE_STRINGS.deleteIntro}
                    </p>
                    <p className="w-full text-start text-[15px] font-medium leading-[170%] text-[#111B18] dark:text-gray-200 sm:text-[16px]">
                        {PROFILE_STRINGS.deleteBody}
                    </p>
                </div>

                <div className="flex w-full items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#EB4335]" strokeWidth={1.5} />
                    <p className="flex-1 text-start text-[14px] font-bold leading-[160%] text-[#EB4335] dark:text-red-400">
                        {PROFILE_STRINGS.deleteWarning}
                    </p>
                </div>

                {error && (
                    <p className="text-center text-[13px] text-red-600 dark:text-red-400" role="alert">
                        {error}
                    </p>
                )}
            </div>
        </ProfileSubpageShell>
    );
}
