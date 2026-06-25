export default function AllBrandsSkeleton() {
    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <div className="flex min-h-[3.25rem] items-center justify-center border-b border-black/[0.04] bg-white px-4 py-2.5">
                <div className="h-5 w-28 animate-pulse rounded-lg bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 px-4 pb-6 pt-4 sm:gap-3 sm:px-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-gray-100" />
                ))}
            </div>
        </div>
    );
}
