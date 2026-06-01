
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";
import { motion } from "framer-motion";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems: number;
    itemsPerPage: number;
    maxVisiblePages?: number;
    disabled?: boolean;
    className?: string;
    dir?: string;
}
const ButtonBase = ({
    children,
    onClick,
    disabled,
    ariaLabel,
    className: btnClassName = "",
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    ariaLabel: string;
    className?: string;
}) => (
    <motion.button
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) onClick();
        }}
        disabled={disabled}
        className={`
      flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg
      transition-all duration-200 font-medium
      ${disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
                : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 active:scale-95"
            }
      border border-gray-200 dark:border-gray-700
      ${btnClassName}
    `}
        aria-label={ariaLabel}
        aria-disabled={disabled}
    >
        {children}
    </motion.button>
);
export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    maxVisiblePages = 7,
    disabled = false,
    className,
    dir,
}: PaginationProps) {
    const { language } = useLanguage();
    const isArabic = language === "ar";

    // Calculate visible page numbers
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate range around current page
            const leftSiblingIndex = Math.max(currentPage - 1, 2);
            const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

            const showLeftDots = leftSiblingIndex > 2;
            const showRightDots = rightSiblingIndex < totalPages - 1;

            if (!showLeftDots && showRightDots) {
                // Show more pages on left
                for (let i = 2; i <= Math.min(maxVisiblePages - 2, totalPages - 1); i++) {
                    pages.push(i);
                }
                pages.push('...');
            } else if (showLeftDots && !showRightDots) {
                // Show more pages on right
                pages.push('...');
                for (let i = Math.max(totalPages - maxVisiblePages + 3, 2); i <= totalPages - 1; i++) {
                    pages.push(i);
                }
            } else {
                // Show dots on both sides
                pages.push('...');
                for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                    pages.push(i);
                }
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const visiblePages = getVisiblePages();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div
            className={`flex flex-col items-center gap-4 py-6 sm:py-8 ${className}`}
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Desktop Pagination */}
            <div className="hidden md:flex items-center gap-2">
                {/* Previous Button */}
                <ButtonBase
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    ariaLabel={isArabic ? "السابق" : "Previous"}
                >
                    {isArabic ? (
                        <ChevronRight size={18} className="shrink-0" />
                    ) : (
                        <ChevronLeft size={18} className="shrink-0" />
                    )}
                    <span className="hidden lg:inline">{isArabic ? "السابق" : "Previous"}</span>
                </ButtonBase>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5">
                    {visiblePages.map((page: number | string, index: number) => {
                        if (page === "ellipsis") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-gray-400 dark:text-gray-500 text-sm sm:text-base"
                                    aria-hidden="true"
                                >
                                    ...
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        const isActive = pageNum === currentPage;

                        return (
                            <motion.button
                                key={pageNum}
                                whileHover={!isActive ? { scale: 1.1, y: -1 } : {}}
                                whileTap={!isActive ? { scale: 0.9 } : {}}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isActive) {
                                        onPageChange(pageNum);
                                    }
                                }}
                                className={`
                  min-w-[40px] h-[40px] rounded-lg
                  transition-all duration-200 font-medium cursor-pointer
                  ${isActive
                                        ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105"
                                        : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    }
                  border border-gray-200 dark:border-gray-700
                `}
                                aria-label={`${isArabic ? "الصفحة" : "Page"} ${pageNum}`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                {pageNum}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <ButtonBase
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    ariaLabel={isArabic ? "التالي" : "Next"}
                >
                    <span className="hidden lg:inline">{isArabic ? "التالي" : "Next"}</span>
                    {isArabic ? (
                        <ChevronLeft size={18} className="shrink-0" />
                    ) : (
                        <ChevronRight size={18} className="shrink-0" />
                    )}
                </ButtonBase>
            </div>

            {/* Mobile Pagination */}
            <div className="flex md:hidden items-center justify-between w-full px-2">
                <ButtonBase
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    ariaLabel={isArabic ? "السابق" : "Previous"}
                    className="flex-1 max-w-[120px] justify-center"
                >
                    {isArabic ? (
                        <ChevronRight size={18} className="shrink-0" />
                    ) : (
                        <ChevronLeft size={18} className="shrink-0" />
                    )}
                    <span>{isArabic ? "السابق" : "Previous"}</span>
                </ButtonBase>

                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 px-4">
                    {isArabic ? "الصفحة" : "Page"} {currentPage} {isArabic ? "من" : "of"} {totalPages}
                </div>

                <ButtonBase
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    ariaLabel={isArabic ? "التالي" : "Next"}
                    className="flex-1 max-w-[120px] justify-center"
                >
                    <span>{isArabic ? "التالي" : "Next"}</span>
                    {isArabic ? (
                        <ChevronLeft size={18} className="shrink-0" />
                    ) : (
                        <ChevronRight size={18} className="shrink-0" />
                    )}
                </ButtonBase>
            </div>

            {/* Results Info */}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                {isArabic ? "إظهار" : "Showing"} {startItem} - {endItem} {isArabic ? "من" : "of"} {totalItems}
            </p>
        </div>
    );
}