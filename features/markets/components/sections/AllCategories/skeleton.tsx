export default function AllCategoriesSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <div className="flex min-h-[3.25rem] items-center justify-center border-b border-white/[0.06] px-4 py-2.5">
                <div className="h-5 w-20 animate-pulse rounded-lg bg-gray-800" />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-8 pt-5 sm:px-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2.5">
                        <div className="h-[72px] w-[72px] animate-pulse rounded-full bg-gray-800 sm:h-[80px] sm:w-[80px]" />
                        <div className="h-3 w-20 animate-pulse rounded bg-gray-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}
