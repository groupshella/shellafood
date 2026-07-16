export default function AllBrandsSkeleton() {
    return (
        <div className="min-h-dvh bg-background">
            <div className="flex min-h-[3.25rem] items-center justify-center border-b border-border bg-background px-3 py-2.5 sm:px-5">
                <div className="h-5 w-28 animate-pulse rounded-lg bg-card" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 px-3 pb-6 pt-4 sm:gap-3 sm:px-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 lg:px-6 xl:grid-cols-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-card sm:h-[76px]" />
                ))}
            </div>
        </div>
    );
}
