export default function PopularBrandsSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-xl bg-gray-200" />
                ))}
            </div>
        </div>
    );
}
