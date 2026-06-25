import { CATEGORY_TABS_HEIGHT_PX } from "./CategoryTabsClient";

export default function CategoryTabsSkeleton() {
    return (
        <div
            className="sticky top-0 z-50 flex items-center gap-2 overflow-hidden bg-[#30913F] px-4 sm:px-5"
            style={{ height: CATEGORY_TABS_HEIGHT_PX }}
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="h-7 w-[4.5rem] shrink-0 animate-pulse rounded-lg bg-white/20 sm:w-20"
                />
            ))}
        </div>
    );
}
