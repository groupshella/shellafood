import { TAJAWAL } from "@/features/profile/constants/statistics.constants";

export function EmptySectionCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-[71px] w-full items-center justify-center rounded-[18px] border border-[#F6F5F8] dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-6 shadow-[0px_1px_8px_rgba(0,0,0,0.04)]">
            <p
                className="text-center text-[14px] font-medium text-[#555555] dark:text-gray-400"
                style={TAJAWAL}
            >
                {children}
            </p>
        </div>
    );
}
