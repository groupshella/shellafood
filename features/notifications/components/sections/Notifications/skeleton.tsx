export default function NotificationsSkeleton() {
    return (
        <div className="space-y-2.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/[0.05]">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-gray-200" />
                    <div className="flex-1 space-y-2 py-0.5">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                        <div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}
