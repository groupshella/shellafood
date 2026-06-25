import Link from "next/link";



import { ArrowRight, Search } from "lucide-react";




const ICON_BTN =

    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-700 transition-colors hover:bg-gray-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2";



export function Topbar({ isAuthenticated }: { isAuthenticated: boolean }) {

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



        </div>

    );

}

