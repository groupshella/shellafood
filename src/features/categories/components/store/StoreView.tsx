// ============================================================================
// STORE VIEW — REDESIGNED UI, ALL LOGIC PRESERVED
// ============================================================================
"use client";

import { useLanguage } from "@/providers";
import {
  useMemo, useState, useTransition, memo,
  useCallback, useEffect
} from "react";
import type { StoreDetails, CategoryDetail } from "../../types/store.details.types";
import {
  Phone, Mail, MapPin, Clock, DollarSign, Star, Tag,
  Calendar, CheckCircle2, XCircle, Gift, Grid3x3, ShoppingCart, ArrowUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StoreHero from "./StoreHero";
import StickyTabs from "./StickyTabs";
import DepartmentCard from "./DepartmentSection";
import Breadcrumbs from "../shared/Breadcrumbs";
import { useMobile } from "@/shared/hooks";
import { EmptyState, MobileStorePageSkeleton } from "../shared";
import { useRouter, useSearchParams } from "next/navigation";
import { getCartItemsCount } from "@/lib/utils/cartStorage";

interface StoreViewProps {
  store: StoreDetails;
  moduleId: string;
  initialLimit: number;
  initialPage: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TABS = [
  { id: "departments", label: "Departments", labelAr: "الأقسام" },
  { id: "info", label: "Info", labelAr: "المعلومات" },
  { id: "reviews", label: "Reviews", labelAr: "التقييمات" },
  { id: "offers", label: "Offers", labelAr: "العروض" },
] as const;

type TabId = typeof TABS[number]["id"];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function StoreView({ store, moduleId, initialLimit, initialPage }: StoreViewProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMobile(768);

  const [activeTab, setActiveTab] = useState<TabId>("departments");
  const [isPending, startTransition] = useTransition();
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // ── translations ──────────────────────────────────────────────────────
  const t = useMemo(
    () => ({
      searchPlaceholder: isArabic ? "ابحث عن أقسام..." : "Search departments...",
      departments: isArabic ? "الأقسام" : "Departments",
      noDepartments: isArabic ? "لا توجد أقسام متاحة" : "No departments available",
      showing: isArabic ? "عرض" : "Showing",
      of: isArabic ? "من" : "of",
      items: isArabic ? "عنصر" : "items",
      loading: isArabic ? "جاري التحميل..." : "Loading...",
      errorLoading: isArabic ? "خطأ في تحميل الأقسام" : "Error loading departments",
      tryAgain: isArabic ? "يرجى المحاولة مرة أخرى" : "Please try again",
      storeInfo: isArabic ? "معلومات المتجر" : "Store Information",
      phone: isArabic ? "الهاتف" : "Phone",
      email: isArabic ? "البريد الإلكتروني" : "Email",
      address: isArabic ? "العنوان" : "Address",
      minOrder: isArabic ? "الحد الأدنى للطلب" : "Minimum Order",
      deliveryFee: isArabic ? "رسوم التوصيل" : "Delivery Fee",
      deliveryTime: isArabic ? "وقت التوصيل" : "Delivery Time",
      businessHours: isArabic ? "ساعات العمل" : "Business Hours",
      closed: isArabic ? "مغلق" : "Closed",
      free: isArabic ? "مجاني" : "Free",
      notAvailable: isArabic ? "غير متوفر" : "Not available",
      notSpecified: isArabic ? "غير محدد" : "Not specified",
      reviews: isArabic ? "التقييمات والمراجعات" : "Reviews & Ratings",
      reviewsCount: isArabic ? "تقييمات" : "reviews",
      rating: isArabic ? "تقييم" : "Rating",
      noReviews: isArabic ? "لا توجد تقييمات متاحة حالياً" : "No reviews available",
      offers: isArabic ? "العروض والكوبونات" : "Offers & Coupons",
      noOffers: isArabic ? "لا توجد عروض متاحة حالياً" : "No offers available",
      couponCode: isArabic ? "رمز الكوبون" : "Coupon Code",
      sar: isArabic ? "ر.س" : "SAR",
    }),
    [isArabic]
  );

  // ── computed values ───────────────────────────────────────────────────

  const currentStore = store;

  const breadcrumbItems = useMemo(
    () => [
      { label: isArabic ? "الرئيسية" : "Home", href: "/home" },
      {
        label: searchParams.get("moduleName") || "القسم",
        href: `/categories/${moduleId}?moduleName=${searchParams.get("moduleName")}`,
      },
      { label: searchParams.get("storeName") || "المتجر" },
    ],
    [isArabic, moduleId, searchParams]
  );

  const filteredDepartments = useMemo(() => {
    if (!currentStore.category_details) return [];
    return currentStore.category_details.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      name_ar: cat.name,
      name_en: cat.name,
      image: cat.image,
      image_full_url: cat.image,
      parent_id: 0,
      position: 0,
      status: 1,
      created_at: "",
      updated_at: "",
      priority: 0,
      module_id: currentStore.module_id || Number(moduleId),
      cat_site_id: "",
      slug: "",
      featured: 0,
      storage: [],
      translations: [],
    } as CategoryDetail));
  }, [currentStore.category_details, currentStore.module_id]);

  // ── scroll to top ─────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => setShowScrollToTop(window.scrollY > 400);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    []
  );

  // ── handlers ──────────────────────────────────────────────────────────

  const handleTabChange = useCallback((tab: string) => {
    startTransition(() => setActiveTab(tab as TabId));
  }, []);

  // ── loading guard ─────────────────────────────────────────────────────

  if (!currentStore) {
    return isMobile ? (
      <MobileStorePageSkeleton />
    ) : (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse space-y-6">
          <div className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-700" />
          <div className="h-8 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── render ────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-950"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Hero */}
      <StoreHero store={currentStore} />

      {/* Sticky tabs */}
      <StickyTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={TABS as unknown as { id: string; label: string; labelAr: string }[]}
      />

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-5 sm:py-7 md:py-9">
        <Breadcrumbs items={breadcrumbItems} className="mb-4 sm:mb-6" />

        {/* Transition spinner */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 flex items-center justify-center gap-2 py-3"
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              <span className="text-xs text-gray-500 dark:text-gray-400">{t.loading}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "departments" && (
            <DepartmentsTab
              key="departments"
              filteredDepartments={filteredDepartments}
              totalCategories={currentStore.categories_pagination?.total_categories || 0}
              isPending={isPending}
              isMobile={isMobile}
              t={t}
              storeId={currentStore.id}
              moduleId={moduleId}
            />
          )}
          {activeTab === "info" && (
            <InfoTab key="info" store={currentStore} t={t} isArabic={isArabic} />
          )}
          {activeTab === "reviews" && (
            <ReviewsTab key="reviews" store={currentStore} t={t} isArabic={isArabic} />
          )}
          {activeTab === "offers" && (
            <OffersTab key="offers" store={currentStore} t={t} isArabic={isArabic} />
          )}
        </AnimatePresence>
      </div>

      {/* Floating cart button */}
      <AnimatePresence>
        {getCartItemsCount() > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => router.push("/cart")}
            className={`fixed ${isArabic ? "left-5" : "right-5"} bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xl transition-transform active:scale-95`}
            style={{
              background: "linear-gradient(135deg,#059669,#10b981)",
              boxShadow: "0 8px 24px rgba(16,185,129,0.45)",
            }}
          >
            <ShoppingCart className="h-6 w-6 text-white" />
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
              {getCartItemsCount() > 99 ? "99+" : getCartItemsCount()}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scroll-to-top button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={scrollToTop}
            className={`fixed ${isArabic ? "right-5" : "left-5"} bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-xl shadow-xl transition-transform active:scale-95 hover:scale-105`}
            style={{
              background: "linear-gradient(135deg,#1f2937,#374151)",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            }}
            aria-label={isArabic ? "الانتقال إلى الأعلى" : "Scroll to top"}
          >
            <ArrowUp className="h-5 w-5 text-white" strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// DEPARTMENTS TAB
// ============================================================================

interface DepartmentsTabProps {
  filteredDepartments: CategoryDetail[];
  totalCategories: number;
  isPending: boolean;
  isMobile: boolean;
  t: any;
  storeId: number;
  moduleId: string;
}

const DepartmentsTab = memo(
  ({ filteredDepartments, totalCategories, t, storeId, moduleId }: DepartmentsTabProps) => {
    const router = useRouter();
    const { language } = useLanguage();
    const isArabic = language === "ar";

    if (filteredDepartments.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <Grid3x3 className="mb-4 h-14 w-14 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-bold text-gray-700 dark:text-white">{t.noDepartments}</h3>
        </motion.div>
      );
    }

    const hasMore = totalCategories > filteredDepartments.length;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        id="departments-list"
      >
        {/* Section header */}
        <div
          className={`mb-5 flex items-center justify-between gap-4 
            }`}
        >
          <div className={isArabic ? "text-right" : "text-left"}>
            <h2 className="text-xl font-black text-gray-900 dark:text-white sm:text-2xl">
              {t.departments}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {isArabic ? `عرض ${filteredDepartments.length} من ${totalCategories} أقسام` : `Showing ${filteredDepartments.length} of ${totalCategories} departments`}
            </p>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          key="dept-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 sm:gap-3 md:gap-4"
        >
          {filteredDepartments.map((dept, idx) => (
            <DepartmentCard
              key={dept.id}
              department={dept}
              index={idx}
              categoryId={parseInt(moduleId)}
              storeId={storeId}
            />
          ))}
        </motion.div>

        {/* "Show all departments" button — replaces pagination */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={() =>
                router.push(`/categories/${moduleId}/${storeId}/departments`)
              }
              className="group inline-flex items-center gap-2.5 rounded-2xl px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg,#059669 0%,#10b981 100%)",
                boxShadow: "0 6px 20px rgba(16,185,129,0.35)",
              }}
            >
              <Grid3x3 className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
              <span>{isArabic ? "عرض جميع الأقسام" : "Show all departments"}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-black"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                {totalCategories}
              </span>
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

DepartmentsTab.displayName = "DepartmentsTab";

// ============================================================================
// INFO TAB
// ============================================================================

const InfoTab = memo(({ store, t, isArabic }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-4 sm:space-y-6"
  >
    {/* Card */}
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Card header */}
      <div
        className="px-5 py-4 sm:px-6 sm:py-5"
        style={{
          background: "linear-gradient(135deg,#0a1f15 0%,#0d2a1c 100%)",
        }}
      >
        <h2 className="text-base font-bold text-white sm:text-lg">{t.storeInfo}</h2>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5">
        {store.phone && (
          <InfoItem
            icon={Phone}
            label={t.phone}
            value={store.phone}
            href={`tel:${store.phone}`}
            isPhone
          />
        )}
        {store.email && (
          <InfoItem
            icon={Mail}
            label={t.email}
            value={store.email}
            href={`mailto:${store.email}`}
          />
        )}
        {store.address && (
          <InfoItem
            icon={MapPin}
            label={t.address}
            value={store.address}
            className="sm:col-span-2"
          />
        )}
        {store.minimum_order && (
          <InfoItem
            icon={DollarSign}
            label={t.minOrder}
            value={`${store.minimum_order} ${t.sar}`}
          />
        )}
        <InfoItem
          icon={Tag}
          label={t.deliveryFee}
          value={
            store.free_delivery
              ? t.free
              : `${store.minimum_shipping_charge || store.price_range?.min_price || "0.00"} ${t.sar}`
          }
          highlight={store.free_delivery}
        />
        <InfoItem
          icon={Clock}
          label={t.deliveryTime}
          value={
            store.delivery_time || store.min_delivery_time
              ? store.delivery_time || `${store.min_delivery_time} min`
              : t.notSpecified
          }
        />
      </div>
    </div>

    {/* Business hours */}
    {store.schedule && (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-gray-900 dark:text-white">{t.businessHours}</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 sm:gap-3 sm:p-5">
          {Object.entries(store.schedule).map(([day, hours]: [string, any], index) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`flex items-center justify-between rounded-xl px-4 py-3 ${hours.is_open
                ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                : "border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30"
                }`}
            >
              <div className="flex items-center gap-2.5">
                {hours.is_open ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-semibold capitalize text-gray-900 dark:text-white">
                  {isArabic ? getArabicDay(day) : day}
                </span>
              </div>
              <span
                className={`text-sm font-medium ${hours.is_open
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-gray-400"
                  }`}
              >
                {hours.is_open
                  ? `${hours.opening_time} – ${hours.closing_time}`
                  : t.closed}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    )}
  </motion.div>
));

InfoTab.displayName = "InfoTab";

// ============================================================================
// REVIEWS TAB
// ============================================================================

const ReviewsTab = memo(({ store, t, isArabic }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
    {/* Header */}
    <div
      className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      style={{
        background: "linear-gradient(135deg,#0a1f15 0%,#0d2a1c 100%)",
      }}
    >
      <div>
        <h2 className="text-base font-bold text-white sm:text-lg">{t.reviews}</h2>
        <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
          {store.rating_count} {t.reviewsCount}
        </p>
      </div>
      <div
        className="inline-flex items-center gap-2.5 rounded-2xl px-4 py-3"
        style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}
      >
        <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
        <span className="text-3xl font-black text-white">
          {(store.avg_rating || 0).toFixed(1)}
        </span>
      </div>
    </div>

    {/* Rating bars */}
    <div className="p-5 sm:p-6">
      {!store.rating_count || store.rating_count === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Star className="mb-3 h-14 w-14 text-gray-200 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">{t.noReviews}</p>
        </div>
      ) : store.ratings && store.ratings.length > 0 ? (
        <div className="space-y-3">
          {store.ratings.map((count: number, index: number) => {
            const rating = 5 - index;
            const percentage = (count / store.rating_count) * 100;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="flex w-12 items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {rating}
                  </span>
                </div>
                <div className="flex-1 h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#f59e0b,#fbbf24)",
                    }}
                  />
                </div>
                <span className="w-8 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {count}
                </span>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Star className="mb-3 h-14 w-14 text-gray-200 dark:text-gray-600" />
          <p className="text-gray-500 dark:text-gray-400">{t.noReviews}</p>
        </div>
      )}
    </div>
  </motion.div>
));

ReviewsTab.displayName = "ReviewsTab";

// ============================================================================
// OFFERS TAB
// ============================================================================

const OffersTab = memo(({ store, t, isArabic }: any) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
  >
    {/* Header */}
    <div
      className="flex items-center gap-3 px-5 py-4 sm:px-6 sm:py-5"
      style={{
        background: "linear-gradient(135deg,#0a1f15 0%,#0d2a1c 100%)",
      }}
    >
      <Gift className="h-5 w-5 text-emerald-400" />
      <h2 className="text-base font-bold text-white sm:text-lg">{t.offers}</h2>
    </div>

    <div className="p-5 sm:p-6">
      {store.active_coupons?.length > 0 || store.combos?.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {(store.active_coupons || store.combos || []).map((coupon: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
              className="relative overflow-hidden rounded-2xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 dark:border-emerald-700 dark:from-emerald-900/20 dark:to-teal-900/20"
            >
              <Tag className="absolute right-3 top-3 h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                {t.couponCode}
              </p>
              <p className="font-mono text-2xl font-black text-emerald-800 dark:text-emerald-300">
                {coupon.code || `COUPON${index + 1}`}
              </p>
              {coupon.description && (
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {coupon.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Gift className="mb-3 h-14 w-14 text-gray-200 dark:text-gray-600" />
          <p className="font-semibold text-gray-700 dark:text-white">{t.noOffers}</p>
        </div>
      )}
    </div>
  </motion.div>
));

OffersTab.displayName = "OffersTab";

// ============================================================================
// INFO ITEM
// ============================================================================

const InfoItem = memo(
  ({
    icon: Icon,
    label,
    value,
    href,
    highlight,
    className = "",
    isPhone = false,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    href?: string;
    highlight?: boolean;
    className?: string;
    isPhone?: boolean;
  }) => {
    const formattedValue = useMemo(
      () => (isPhone && value ? value.trim() : value),
      [value, isPhone]
    );

    const content = (
      <div
        className={`flex items-start gap-3 rounded-xl p-3.5 sm:p-4 transition-all duration-150 hover:shadow-sm ${highlight
          ? "border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/40"
          } ${className}`}
      >
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${highlight
            ? "bg-emerald-100 dark:bg-emerald-900/40"
            : "bg-white dark:bg-gray-800"
            }`}
        >
          <Icon
            className={`h-4 w-4 sm:h-5 sm:w-5 ${highlight
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-500 dark:text-gray-400"
              }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <dt className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500 sm:text-xs">
            {label}
          </dt>
          <dd
            className={`break-words text-sm font-bold sm:text-base ${highlight
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-gray-900 dark:text-white"
              }`}
          >
            {isPhone ? (
              <span dir="ltr" className="inline-block">
                {formattedValue}
              </span>
            ) : (
              formattedValue
            )}
          </dd>
        </div>
      </div>
    );

    return href ? (
      <a href={href} className="block hover:scale-[1.01] transition-transform duration-150">
        {content}
      </a>
    ) : (
      content
    );
  }
);

InfoItem.displayName = "InfoItem";

// ============================================================================
// HELPERS
// ============================================================================

function getArabicDay(day: string): string {
  const days: Record<string, string> = {
    sunday: "الأحد",
    monday: "الاثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
  };
  return days[day.toLowerCase()] || day;
}

export default memo(StoreView);