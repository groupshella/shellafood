export default function CurrentOffersSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-3 px-4">
            <div className="h-7 w-36 animate-pulse rounded-lg bg-gray-100" />
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-[268px] w-[172px] shrink-0 animate-pulse rounded-2xl bg-gray-100"
                    />
                ))}
            </div>
        </div>
    );
}
