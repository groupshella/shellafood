export default function MyPointsSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 px-4 pt-6 md:max-w-[720px]">
            <div className="h-[140px] w-full animate-pulse rounded-[16px] bg-[#EFE6FF]/70 dark:bg-[#2D1F47]/70" />
            <div className="h-5 w-28 animate-pulse rounded bg-[#F0EFF3] dark:bg-gray-700" />
            <div className="mx-auto mt-8 h-[180px] w-[180px] animate-pulse rounded-full bg-[#F0EFF3] dark:bg-gray-700" />
        </div>
    );
}
