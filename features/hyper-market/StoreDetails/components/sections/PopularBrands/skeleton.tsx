export default function PopularBrandsSkeleton() {
    return (
        <section
            className="w-full bg-transparent px-3 pb-5 pt-3 sm:px-5 lg:px-6"
            aria-hidden
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="h-7 w-48 animate-pulse rounded-lg bg-card" />
                <div className="h-9 w-24 animate-pulse rounded-lg bg-card" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:grid-cols-3 lg:grid-cols-4">
                <div className="h-[68px] animate-pulse rounded-2xl bg-card sm:h-[76px]" />
                <div className="h-[68px] animate-pulse rounded-2xl bg-card sm:h-[76px]" />
                <div className="hidden h-[68px] animate-pulse rounded-2xl bg-card sm:h-[76px] md:block" />
                <div className="hidden h-[68px] animate-pulse rounded-2xl bg-card sm:h-[76px] lg:block" />
            </div>
        </section>
    );
}
