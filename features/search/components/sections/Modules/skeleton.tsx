export default function ModulesSkeleton() {
    return (
        <div className="space-y-3">
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-14 w-36 shrink-0 animate-pulse rounded-2xl bg-gray-200"
                    />
                ))}
            </div>
        </div>
    );
}
