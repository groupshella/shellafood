"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";

interface ModuleTopbarProps {
    moduleName: string;
    moduleId: string;
}

export default function ModuleTopbar({ moduleName, moduleId }: ModuleTopbarProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="sticky top-0 z-20 border-b border-black/[0.04] bg-white/95 backdrop-blur-md"
        >
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6 sm:py-4">
                <div className="relative flex min-h-10 items-center justify-center">
                    <Link
                        href="/home"
                        className={[
                            "absolute right-0 flex h-10 w-10 items-center justify-center rounded-full",
                            "text-gray-700 transition-colors hover:bg-gray-100",
                            "active:scale-95",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2",
                        ].join(" ")}
                        aria-label="العودة إلى الرئيسية"
                    >
                        <ArrowRight className="h-5 w-5" strokeWidth={2} />
                    </Link>

                    <h1 className="max-w-[70%] truncate px-12 text-center text-base font-bold text-gray-900 sm:max-w-[60%] sm:text-lg">
                        {moduleName}
                    </h1>
                    <Link
                        href={`/search?module_id=${moduleId}`}
                        className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400"
                    >
                        <Search className="h-5 w-5" strokeWidth={2} />
                    </Link>

                </div>


            </div>
        </motion.header>
    );
}
