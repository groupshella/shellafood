import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";

const ICON_BTN =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-700 transition-colors hover:bg-gray-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2";

export function Topbar({ isAuthenticated }: { isAuthenticated: boolean }) {
    const ctaHref = isAuthenticated ? "/auth/login" : "/auth";
    const ctaLabel = isAuthenticated
        ? "ضع عنوانك لتكتشف خدماتنا بسهولة"
        : "انضم إلينا ، واستمتع بخدمات شلة";

    return (
        <div className="space-y-3 pb-1">
            <header className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md">
                <div className="relative flex min-h-[3.25rem] items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3">
                    <Link href="/home" className={`${ICON_BTN} absolute right-4 sm:right-5`} aria-label="العودة إلى الرئيسية">
                        <ArrowRight className="h-5 w-5 text-[#30913F]" strokeWidth={2} />
                    </Link>

                    <h1 className="max-w-[52%] truncate px-14 text-center text-base font-bold tracking-tight text-gray-900 sm:max-w-[60%] sm:text-lg">
                        هايبر ماركت
                    </h1>

                    <Link
                        href="/search?module_id=3"
                        className={`${ICON_BTN} absolute left-4 sm:left-5`}
                        aria-label="بحث"
                    >
                        <Search className="h-5 w-5" strokeWidth={2} />
                    </Link>
                </div>
            </header>

            <div className="px-4 sm:px-5">
                <Link
                    href={ctaHref}
                    className={[
                        "flex w-full items-center justify-between gap-3 rounded-xl bg-gray-100 px-3.5 py-3",
                        "transition-colors hover:bg-gray-200/80 active:scale-[0.99]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                    ].join(" ")}
                >
                    <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-700 sm:text-[15px]">
                        {ctaLabel}
                    </p>
                    <ArrowLeft className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} aria-hidden />
                </Link>
            </div>

            <div className="px-4 sm:px-5">
                <div
                    className={[
                        "group relative w-full overflow-hidden rounded-2xl",
                        "bg-gradient-to-br from-gray-100 to-gray-200",
                        "shadow-sm ring-1 ring-black/[0.04]",
                        "aspect-[2.4/1] sm:aspect-[21/7] md:aspect-[21/6]",
                    ].join(" ")}
                >
                    <Image
                        src="/hyper-market/banner.png"
                        alt="عرض ترويجي — هايبر ماركت"
                        fill
                        priority
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 672px, 896px"
                    />
                    <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"
                        aria-hidden
                    />
                </div>
            </div>
        </div>
    );
}
