import { SkeletonBlock } from "./shared/SkeletonBlock";

export default function StatisticsSkeleton() {
    return (
        <div className="mx-auto flex w-full max-w-[343px] flex-col gap-6 px-4 pt-4 md:max-w-[720px]">
            <SkeletonBlock className="h-[44px] w-full rounded-[12px]" />
            <div className="grid grid-cols-2 gap-2 md:gap-4">
                <SkeletonBlock className="h-[93px]" />
                <SkeletonBlock className="h-[93px]" />
            </div>
            <SkeletonBlock className="h-[220px] w-full rounded-[16px]" />
            <div className="flex flex-col gap-3">
                <SkeletonBlock className="h-[72px]" />
                <SkeletonBlock className="h-[72px]" />
            </div>
        </div>
    );
}
