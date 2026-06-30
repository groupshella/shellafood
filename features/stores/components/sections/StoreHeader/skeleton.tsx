export default function StoreHeaderSkeleton() {
    return (
        <div className="animate-pulse bg-white">
            {/* Green hero */}
            <div className="h-[120px] bg-[#1B5E20] px-4 pt-4">
                <div className="flex items-center justify-between">
                    <div className="h-9 w-9 rounded-full bg-white/20" />
                    <div className="flex gap-2">
                        <div className="h-9 w-9 rounded-full bg-white/20" />
                        <div className="h-9 w-9 rounded-full bg-white/20" />
                    </div>
                </div>
            </div>

            {/* Overlapping card */}
            <div className="relative -mt-12 px-4">
                <div className="absolute end-4 -top-10 h-[76px] w-[76px] rounded-2xl bg-gray-100" />
                <div className="rounded-2xl bg-white px-4 pb-4 pt-3 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1 space-y-2 pe-[84px]">
                            <div className="flex gap-2">
                                <div className="h-6 w-24 rounded-full bg-gray-100" />
                                <div className="h-6 w-20 rounded-full bg-gray-100" />
                            </div>
                            <div className="h-5 w-40 rounded bg-gray-100 ms-auto" />
                            <div className="h-4 w-56 rounded bg-gray-100 ms-auto" />
                        </div>
                        <div className="h-7 w-14 shrink-0 rounded-lg bg-gray-100" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-3 flex gap-2 px-4 pb-3">
                {[80, 64, 88, 72].map((w, i) => (
                    <div key={i} className="h-8 rounded-full bg-gray-100" style={{ width: w }} />
                ))}
            </div>
        </div>
    );
}
