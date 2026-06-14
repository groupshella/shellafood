export default function Loading() {
    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-[#f8fbf9] to-[#eef6f0]"
        >
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-[#30913F]/10"
            >
                <div className="h-full w-full origin-left animate-pulse bg-gradient-to-r from-[#30913F]/20 via-[#30913F] to-[#30913F]/20 motion-reduce:animate-none" />
            </div>

            <div className="flex flex-col items-center gap-6 px-6">
                <div className="relative flex h-16 w-16 items-center justify-center">
                    <div
                        aria-hidden
                        className="absolute inset-0 rounded-full border-[3px] border-[#30913F]/15"
                    />
                    <div
                        aria-hidden
                        className="absolute inset-0 motion-safe:animate-spin rounded-full border-[3px] border-transparent border-t-[#30913F] border-r-[#30913F]/50 motion-reduce:animate-none"
                    />

                </div>

                <div className="flex flex-col items-center gap-3">
                    <p className="text-sm font-semibold tracking-tight text-gray-800">
                        جاري التحميل...
                    </p>

                    <div className="flex items-center gap-1.5" aria-hidden>
                        {[0, 150, 300].map((delay) => (
                            <span
                                key={delay}
                                className="h-2 w-2 rounded-full bg-[#30913F] motion-safe:animate-bounce motion-reduce:animate-none"
                                style={{ animationDelay: `${delay}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <span className="sr-only">جاري التحميل، يرجى الانتظار</span>
        </div>
    );
}
