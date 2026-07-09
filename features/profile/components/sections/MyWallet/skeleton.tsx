export default function MyWalletSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 px-4 pt-6 md:max-w-[720px]">
            <div className="h-[120px] w-full animate-pulse rounded-[16px] bg-[#30913F]/30" />
            <div className="flex items-center justify-between">
                <div className="h-5 w-28 animate-pulse rounded bg-[#F0EFF3] dark:bg-gray-700" />
                <div className="h-8 w-36 animate-pulse rounded-[8px] bg-[#F0EFF3] dark:bg-gray-700" />
            </div>
            <div className="mx-auto mt-8 h-[160px] w-[220px] animate-pulse rounded-[12px] bg-[#F0EFF3] dark:bg-gray-700" />
        </div>
    );
}
