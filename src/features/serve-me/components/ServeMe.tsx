"use client";
import React, { useCallback, useState } from "react";
import { HeroSection } from "./HeroSection";
import { ServicesGrid } from "./ServicesGrid";
import { FeaturesSection } from "./FeaturesSection";
import { SERVE_ME_FEATURES } from "../constants/serve-me.constants";
import { useActiveServices, useServiceSearch } from "../hooks/useServices";
import type { MainServiceDto } from "../types/serve-me.types";
import { PickAndOrderSection } from "./PickAndOrderSection";

/**
 * ServeMe Component (اخدمني)
 * Main component for the serve-me service page
 */
export default function ServeMe() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch active services from API
  const { services: apiServices, loading: servicesLoading, error: servicesError } = useActiveServices();

  // Search functionality
  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    search,
    clearResults,
  } = useServiceSearch();

  // Determine which services to display
  const displayServices = searchQuery ? searchResults : apiServices;
  const isLoading = searchQuery ? searchLoading : servicesLoading;
  const currentError = searchQuery ? searchError : servicesError;

  // Map API services to component format
  const mappedServices: MainServiceDto[] = displayServices.map((service: MainServiceDto) => ({
    id: service.id,
    title: service.title,
    description: service.description || "",
    imageUrl: service.imageUrl || "",
    isActive: service.isActive,
    createdAt: service.createdAt,
  }));

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (query.trim().length >= 2) {
        search(query);
      } else {
        clearResults();
      }
    },
    [search, clearResults]
  );

  // Show error if exists
  if (currentError && !isLoading) {
    console.error("Services error:", currentError);
  }

  return (
    <div className="rtl mb-8" dir="rtl">
    {/* Hero Section */}
<HeroSection
  title="كل خدماتك في مكان واحد"
  subtitle="من الطلبات اليومية إلى الشحن الثقيل والمتخصص، نوفر لك حلولاً ذكية مصممة لتناسب احتياجك وتمنحك تجربة سلسة من البداية حتى التسليم."
  onSearch={handleSearch}
/>

<PickAndOrderSection />


      {/* Services Grid */}
      <ServicesGrid
        services={mappedServices}
        loading={isLoading}
        emptyMessage={
          searchQuery
            ? `لم يتم العثور على نتائج لـ "${searchQuery}"`
            : "لا توجد خدمات متاحة حالياً"
        }
      />
      {/* Features Section */}
      <FeaturesSection features={SERVE_ME_FEATURES} />
    </div>
  );
}