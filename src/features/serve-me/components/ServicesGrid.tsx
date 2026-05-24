import React, { memo } from "react";
import { ServiceCard } from "./ServiceCard";
import type { MainServiceDto } from "../types/serve-me.types";

interface ServicesGridProps {
  services: MainServiceDto[];
  loading?: boolean;
  emptyMessage?: string;
}

export const ServicesGrid: React.FC<ServicesGridProps> = memo(
  ({ services, loading = false, emptyMessage = "لا توجد خدمات متاحة" }) => {
    // Loading state
    if (loading) {
      return (
        <div className="bg-gray-50 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                خدماتنا
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                اختر من بين مجموعة واسعة من الخدمات
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 h-48 sm:h-56 md:h-64 lg:h-72 rounded-xl sm:rounded-2xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Empty state
    if (services.length === 0) {
      return (
        <div className="bg-gray-50 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                خدماتنا
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                اختر من بين مجموعة واسعة من الخدمات
              </p>
            </div>
            <div className="text-center py-8 sm:py-12 md:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-base sm:text-lg md:text-xl text-gray-500">
                {emptyMessage}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              خدماتنا
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              اختر من بين مجموعة واسعة من الخدمات
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id || index} {...service} />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ServicesGrid.displayName = "ServicesGrid";