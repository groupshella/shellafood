"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { useEffect } from "react";
import { JOIN_STRINGS } from "@/features/profile/constants/join.strings";

interface JoinSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function JoinSuccessModal({ isOpen, onClose }: JoinSuccessModalProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-50 bg-black/30"
                        onClick={onClose}
                        aria-hidden
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-label={JOIN_STRINGS.successTitle}
                            dir="rtl"
                            initial={{ opacity: 0, scale: 0.92, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 12 }}
                            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                            className="relative max-h-[calc(100dvh-3rem)] w-full max-w-sm overflow-y-auto rounded-[32px] bg-white px-5 pb-10 pt-12 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:bg-gray-900 dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:px-6 md:max-w-md"
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute start-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors active:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:active:bg-gray-700"
                                aria-label="إغلاق"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-7 sm:mb-8">
                                    <div
                                        className="absolute inset-0 scale-150 rounded-full bg-[#30913F]/10 blur-xl"
                                        aria-hidden
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 0.1,
                                        }}
                                        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#3DA84C] to-[#30913F] shadow-[0_8px_24px_rgba(48,145,63,0.35)] sm:h-24 sm:w-24"
                                    >
                                        <Check className="h-9 w-9 text-white sm:h-10 sm:w-10" strokeWidth={3} aria-hidden />
                                    </motion.div>
                                </div>

                                <h2 className="text-lg font-bold leading-snug text-gray-900 dark:text-gray-50 sm:text-[18px]">
                                    {JOIN_STRINGS.successTitle}
                                </h2>
                                <p className="mt-2 text-[14px] leading-relaxed text-gray-600 dark:text-gray-300">
                                    {JOIN_STRINGS.successSubtitle}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
