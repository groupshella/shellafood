
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/providers/LanguageProvider";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  maxVisiblePages?: number;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  maxVisiblePages = 7,
  disabled = false,
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
    <div className="mt-8 sm:mt-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Results info */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isArabic
            ? `عرض ${startItem} إلى ${endItem} من ${totalItems} نتيجة`
            : `Showing ${startItem} to ${endItem} of ${totalItems} results`}
        </p>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || disabled}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={isArabic ? "الصفحة السابقة" : "Previous page"}
          >
            {isArabic ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Page numbers */}
          {visiblePages.map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
              disabled={page === '...' || page === currentPage || disabled}
              className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all ${
                page === currentPage
                  ? 'bg-green-600 text-white shadow-lg'
                  : page === '...'
                  ? 'cursor-default'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              } disabled:cursor-not-allowed`}
            >
              {page}
            </button>
          ))}

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || disabled}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={isArabic ? "الصفحة التالية" : "Next page"}
          >
             {isArabic ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}