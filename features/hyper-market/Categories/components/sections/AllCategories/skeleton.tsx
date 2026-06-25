export default function AllCategoriesSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="flex min-h-[3.25rem] items-center justify-center border-b border-black/[0.04] px-4 py-2.5">
                <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-100" />
            </div>

            <div className="grid grid-cols-3 gap-2 px-3 pb-6 pt-4 sm:gap-2.5 sm:px-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100"
                    />
                ))}
            </div>
        </div>
    );
}
