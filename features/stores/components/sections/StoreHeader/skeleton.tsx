export default function StoreHeaderSkeleton() {
    return (
        <div className="animate-pulse bg-white">
            <div className="h-[155px] bg-[#2E7D32]" />

            <div className="relative -mt-8 px-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-end gap-2">
                        <div className="h-[81px] w-[71px] shrink-0 rounded bg-gray-100" />
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                                <div className="h-[19px] w-[98px] rounded bg-gray-100" />
                                <div className="h-[19px] w-[73px] rounded bg-gray-100" />
                            </div>
                            <div className="h-5 w-36 rounded bg-gray-100" />
                            <div className="h-5 w-44 rounded bg-gray-100" />
                        </div>
                    </div>
                    <div className="shrink-0 pt-[34px]">
                        <div className="h-[19px] w-[47px] rounded-e-lg bg-gray-100" />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-2 px-4 pb-3">
                {[61, 117, 93, 65, 72].map((w, i) => (
                    <div
                        key={i}
                        className="h-[37px] shrink-0 rounded-[5px] bg-gray-100"
                        style={{ width: w }}
                    />
                ))}
            </div>
        </div>
    );
}
