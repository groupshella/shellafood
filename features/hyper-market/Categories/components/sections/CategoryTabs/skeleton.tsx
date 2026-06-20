export default function CategoryTabsSkeleton() {
    return (
        <div className="sticky top-[57px] z-30 flex gap-4 overflow-hidden border-b border-white/15 bg-[#30913F] px-4 py-2.5 sm:px-5">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 w-20 shrink-0 animate-pulse rounded bg-white/20" />
            ))}
        </div>
    );
}
