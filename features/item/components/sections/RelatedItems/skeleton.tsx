export default function RelatedItemsSkeleton() {
    return (
        <section className="mt-2 bg-white pb-8 pt-4">
            <div className="mb-3 h-4 w-32 animate-pulse rounded bg-gray-200 px-4 sm:px-5" />
            <div className="flex gap-2 px-4 sm:px-5">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-36 w-28 shrink-0 animate-pulse rounded-xl bg-gray-100" />
                ))}
            </div>
        </section>
    );
}
