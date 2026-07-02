export default function OrderDetailSkeleton() {
    return (
        <div className="mx-auto min-h-screen w-full max-w-lg bg-white animate-pulse" dir="rtl">
            <div className="sticky top-0 z-20 bg-white shadow-sm px-5 py-4">
                <div className="mx-auto h-5 w-32 rounded bg-gray-200" />
            </div>

            <div className="px-4 py-4 pb-28">
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] overflow-hidden px-4 py-4">
                    <div className="h-4 w-24 rounded bg-gray-200 mb-4" />

                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-36 rounded bg-gray-200" />
                            <div className="h-3 w-48 rounded bg-gray-100" />
                        </div>
                        <div className="mr-3 h-14 w-14 rounded-xl bg-gray-100" />
                    </div>

                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-b-0">
                            <div className="h-[60px] w-[60px] rounded-xl bg-gray-100" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-full rounded bg-gray-200" />
                                <div className="h-3 w-3/4 rounded bg-gray-100" />
                                <div className="h-3 w-16 rounded bg-gray-200" />
                            </div>
                            <div className="h-6 w-6 rounded-full bg-gray-200" />
                        </div>
                    ))}

                    <div className="my-4 h-px bg-gray-100" />

                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex justify-between py-2">
                            <div className="h-3 w-24 rounded bg-gray-100" />
                            <div className="h-3 w-16 rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white px-4 py-4">
                <div className="h-12 w-full rounded-xl bg-gray-200" />
            </div>
        </div>
    );
}
