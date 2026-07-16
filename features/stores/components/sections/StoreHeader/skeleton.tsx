export default function StoreHeaderSkeleton() {
    return (
        <div className="animate-pulse bg-background">
            <div className="h-36 bg-brand/40 sm:h-40 md:h-52 lg:h-64 xl:h-72" />

            <div className="relative -mt-7 px-3 pb-2 sm:-mt-8 sm:px-4 md:-mt-10 md:px-5 md:pb-3 lg:-mt-12 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                <div className="flex items-start justify-between gap-2.5 sm:gap-3 md:gap-4">
                    <div className="flex min-w-0 items-end gap-2 sm:gap-2.5 md:gap-3.5">
                        <div className="h-[72px] w-[64px] shrink-0 rounded bg-card ring-1 ring-border sm:h-[80px] sm:w-[72px] md:h-[96px] md:w-[88px] md:rounded-md lg:h-[104px] lg:w-[96px]" />
                        <div className="flex flex-col items-end gap-1.5 pb-0.5 sm:gap-2 sm:pb-1">
                            <div className="flex gap-1 sm:gap-1.5">
                                <div className="h-5 w-20 rounded bg-card sm:h-[22px] sm:w-24 md:h-6" />
                                <div className="h-5 w-14 rounded bg-card sm:h-[22px] sm:w-16 md:h-6" />
                            </div>
                            <div className="h-5 w-32 rounded bg-border sm:w-36 md:h-7 md:w-48" />
                            <div className="h-4 w-40 rounded bg-card sm:w-44 md:w-64" />
                        </div>
                    </div>
                    <div className="shrink-0 pt-7 sm:pt-9 md:pt-12">
                        <div className="h-5 w-11 rounded-lg bg-card sm:h-[22px] sm:w-12 md:h-7 md:w-14 md:rounded-xl" />
                    </div>
                </div>
            </div>

            <div className="flex gap-1.5 px-3 pb-3 pt-3 sm:gap-2 sm:px-4 sm:pt-4 md:gap-2.5 md:border-b md:border-border md:px-5 md:pb-3.5 md:pt-3.5 lg:mx-auto lg:max-w-4xl lg:px-6 xl:max-w-5xl 2xl:max-w-6xl">
                {[70, 120, 95, 68, 80].map((w, i) => (
                    <div
                        key={i}
                        className="h-8 shrink-0 rounded-lg bg-card sm:h-9 md:h-10"
                        style={{ width: w }}
                    />
                ))}
            </div>
        </div>
    );
}
