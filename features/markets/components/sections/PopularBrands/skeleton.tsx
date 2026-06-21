export default function PopularBrandsSkeleton() {
    const columnWidth = "calc((100% - 0.75rem) / 2.08)";

    return (
        <div className="w-full space-y-3 px-4 sm:px-6">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="flex shrink-0 flex-col gap-3"
                        style={{ width: columnWidth }}
                    >
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-100" />
                        <div className="h-[76px] animate-pulse rounded-2xl bg-gray-100" />
                    </div>
                ))}
            </div>
        </div>
    );
}
