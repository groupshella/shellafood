export default function CategoriesSkeleton() {
    return (
        <div className="space-y-4 bg-black py-4">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6">
                <div className="h-5 w-16 animate-pulse rounded-lg bg-gray-800 sm:h-6 sm:w-20" />
                <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-800 sm:h-9 sm:w-28" />
            </div>

            <div className="flex gap-3 overflow-hidden px-4 sm:px-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex w-[5.5rem] shrink-0 flex-col items-center gap-2.5">
                        <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-gray-800 sm:h-[80px] sm:w-[80px]" />
                        <div className="h-3 w-14 animate-pulse rounded bg-gray-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}
