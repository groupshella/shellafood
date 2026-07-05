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
                <div className="mx-auto flex w-full max-w-[343px] flex-col gap-4">
                    <label className="flex cursor-pointer items-center justify-start gap-2">
                        <button
                            type="button"
                            role="checkbox"
                            aria-checked={agreed}
                            onClick={() => setAgreed((prev) => !prev)}
                            className={[
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-[1.5px] transition-colors",
                                agreed
                                    ? "border-[#30913F] bg-[#30913F] text-white"
                                    : "border-[#555555] bg-white",
                            ].join(" ")}
                        >
                            {agreed && <span className="text-[12px] leading-none">✓</span>}
                        </button>
                        <span className="text-[14px] font-medium leading-[160%] text-[#555555]">
                            {PROFILE_STRINGS.deleteAgree}
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={!canDelete}
                        className={[
                            "flex h-[47px] w-full items-center justify-center rounded-xl text-[16px] font-bold leading-[160%] transition-colors",
                            canDelete
                                ? "bg-[#EB4335] text-white active:bg-[#d63a2e]"
                                : "cursor-not-allowed bg-[#E2E4E6] text-[#555555]",
                        ].join(" ")}
                    >
                        {PROFILE_STRINGS.deleteAccount}
                    </button>
                </div>
            }
        >
            <div className="mx-auto flex w-full max-w-[343px] flex-col gap-4">
                <div className="flex flex-col items-start gap-1">
                    <p className="w-full text-start text-[16px] font-bold leading-[160%] text-[#111B18]">
                        {PROFILE_STRINGS.deleteIntro}
                    </p>
                    <p className="w-full text-start text-[16px] font-medium leading-[160%] text-[#111B18]">
                        {PROFILE_STRINGS.deleteBody}
                    </p>
                </div>

                <div className="flex w-full items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#EB4335]" strokeWidth={1.5} />
                    <p className="flex-1 text-start text-[14px] font-bold leading-[160%] text-[#EB4335]">
                        {PROFILE_STRINGS.deleteWarning}
                    </p>
                </div>

                {error && <p className="text-center text-[13px] text-red-600">{error}</p>}
            </div>
        </ProfileSubpageShell>
    );
}
