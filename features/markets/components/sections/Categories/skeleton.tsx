export default function CategoriesSkeleton() {
    return (
        <div className="flex gap-3 overflow-hidden px-4 sm:px-6">
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="aspect-square w-[132px] shrink-0 animate-pulse rounded-2xl bg-gray-100 sm:w-[148px] md:w-[160px]"
                />
            ))}
        </div>
    );
}
