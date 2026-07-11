"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, X, Store, Clock, ChevronLeft } from "lucide-react";
import type { ApiOrder, OrderStatus, FilterState, DateGroupLabel } from "@/features/my-orders/types/orders.types";
import { OrdersEmpty } from "./OrdersEmpty";

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    preparing: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", label: "تحت الإعداد" },
    confirmed: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400", label: "مؤكد" },
    processing: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", label: "قيد التحضير" },
    handover: { bg: "bg-orange-50 dark:bg-orange-950/40", text: "text-orange-500 dark:text-orange-400", label: "جاري التسليم" },
    picked_up: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400", label: "في الطريق" },
    delivered: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", label: "تم التوصيل" },
    completed: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400", label: "مكتمل" },
    cancelled: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-500 dark:text-red-400", label: "ملغى" },
    canceled: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-500 dark:text-red-400", label: "ملغى" },
    failed: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-500 dark:text-red-400", label: "فشل" },
    expired: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-500 dark:text-gray-400", label: "منتهي" },
};

const STATUS_CHIPS: { id: OrderStatus; label: string }[] = [
    { id: "preparing", label: "تحت الإعداد" },
    { id: "completed", label: "مكتمل" },
    { id: "cancelled", label: "ملغى" },
];

const TIME_CHIPS = ["اليوم", "هذا الأسبوع", "هذا الشهر"];
const EMPTY_FILTER: FilterState = { date: "", timePeriod: null, statuses: [] };

// ── Date-group helpers ────────────────────────────────────────────────────────

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}
function yesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}
function startOfWeekStr() {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().slice(0, 10);
}
function startOfMonthStr() {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
}
function dateGroupLabel(orderDate: string): DateGroupLabel {
    if (orderDate === todayStr()) return "اليوم";
    if (orderDate === yesterdayStr()) return "الأمس";
    return "الأقدم";
}
function matchesTimePeriod(orderDate: string, period: string): boolean {
    const today = todayStr();
    if (period === "اليوم") return orderDate === today;
    if (period === "هذا الأسبوع") return orderDate >= startOfWeekStr() && orderDate <= today;
    if (period === "هذا الشهر") return orderDate >= startOfMonthStr() && orderDate <= today;
    return true;
}

const GROUP_ORDER: DateGroupLabel[] = ["اليوم", "الأمس", "الأقدم"];

const HEADER_PADDING = "px-3 sm:px-4 md:px-5 lg:px-6";
const CONTENT_PADDING = "px-3 py-4 pb-24 sm:px-4 sm:py-5 sm:pb-28 md:px-5 lg:px-6";
const ORDERS_GRID = "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:gap-5";

const TAB_CHIP = [
    "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
    "min-h-10 sm:px-4 sm:py-1.5 sm:text-sm",
].join(" ");

const FILTER_CHIP = [
    "min-h-10 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
    "sm:px-4 sm:py-1.5 sm:text-sm",
].join(" ");

// ── Module helpers ────────────────────────────────────────────────────────────

function getModuleId(order: ApiOrder): number {
    return order.store?.module_id ?? order.module_id;
}
function getModuleName(order: ApiOrder): string {
    return order.store?.module?.module_name ?? order.module_name;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
    orders: ApiOrder[];
}

export function OrdersClient({ orders }: Props) {
    const [activeModuleId, setActiveModuleId] = useState<number | "all">("all");
    const [filterOpen, setFilterOpen] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [draftFilter, setDraftFilter] = useState<FilterState>(EMPTY_FILTER);
    const [appliedFilter, setAppliedFilter] = useState<FilterState>(EMPTY_FILTER);

    const moduleTabs = useMemo(() => {
        const seen = new Map<number, string>();
        for (const o of orders) {
            const id = getModuleId(o);
            if (!seen.has(id)) seen.set(id, getModuleName(o));
        }
        return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const moduleMatch = activeModuleId === "all" || getModuleId(o) === activeModuleId;

            const statusMatch =
                appliedFilter.statuses.length === 0 ||
                appliedFilter.statuses.includes(o.order_status as OrderStatus);

            const dateMatch =
                appliedFilter.date === "" || o.order_date === appliedFilter.date;

            const periodMatch =
                appliedFilter.timePeriod === null ||
                matchesTimePeriod(o.order_date, appliedFilter.timePeriod);

            return moduleMatch && statusMatch && dateMatch && periodMatch;
        });
    }, [orders, activeModuleId, appliedFilter]);

    const groupedOrders = useMemo(() => {
        const map = new Map<DateGroupLabel, ApiOrder[]>();
        for (const o of filteredOrders) {
            const label = dateGroupLabel(o.order_date);
            if (!map.has(label)) map.set(label, []);
            map.get(label)!.push(o);
        }
        return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
            label: g,
            orders: map.get(g)!,
        }));
    }, [filteredOrders]);

    const hasActiveFilters =
        appliedFilter.statuses.length > 0 ||
        appliedFilter.timePeriod !== null ||
        appliedFilter.date !== "";

    const openFilter = useCallback(() => {
        setDraftFilter(appliedFilter);
        setFilterOpen(true);
        requestAnimationFrame(() => requestAnimationFrame(() => setFilterVisible(true)));
    }, [appliedFilter]);

    const closeFilter = useCallback(() => {
        setFilterVisible(false);
        setTimeout(() => setFilterOpen(false), 350);
    }, []);

    const applyFilter = useCallback(() => {
        setAppliedFilter(draftFilter);
        closeFilter();
    }, [draftFilter, closeFilter]);

    const toggleStatus = (status: OrderStatus) => {
        setDraftFilter((prev) => ({
            ...prev,
            statuses: prev.statuses.includes(status)
                ? prev.statuses.filter((s) => s !== status)
                : [...prev.statuses, status],
        }));
    };

    useEffect(() => {
        document.body.style.overflow = filterOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [filterOpen]);

    const hasNoOrders = orders.length === 0;

    return (
        <>
            <header className="sticky top-0 z-20 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:bg-gray-900 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
                <div className={`relative flex items-center justify-center py-3.5 sm:py-4 ${HEADER_PADDING}`}>
                    {!hasNoOrders ? (
                        <button
                            type="button"
                            onClick={openFilter}
                            aria-label="فلتر"
                            className="absolute end-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:active:bg-gray-700 sm:end-4 sm:h-11 sm:w-11"
                        >
                            <SlidersHorizontal className="h-[18px] w-[18px] text-gray-700 dark:text-gray-300 sm:h-5 sm:w-5" strokeWidth={1.8} aria-hidden />
                            {hasActiveFilters && (
                                <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#30913F] ring-2 ring-white dark:ring-gray-900" />
                            )}
                        </button>
                    ) : null}
                    <h1 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-[17px] lg:text-lg">طلباتي</h1>
                </div>

                {!hasNoOrders ? (
                    <div
                        role="tablist"
                        aria-label="تصفية حسب القسم"
                        className={`flex gap-2 overflow-x-auto pb-3 pt-1 sm:gap-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${HEADER_PADDING}`}
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeModuleId === "all"}
                            onClick={() => setActiveModuleId("all")}
                            className={[
                                TAB_CHIP,
                                activeModuleId === "all"
                                    ? "bg-[#30913F] text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
                            ].join(" ")}
                        >
                            الكل
                        </button>
                        {moduleTabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeModuleId === tab.id}
                                onClick={() => setActiveModuleId(tab.id)}
                                className={[
                                    TAB_CHIP,
                                    activeModuleId === tab.id
                                        ? "bg-[#30913F] text-white shadow-sm"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
                                ].join(" ")}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                ) : null}
            </header>

            <main className={`space-y-1 ${CONTENT_PADDING}`}>
                {hasNoOrders ? (
                    <OrdersEmpty />
                ) : filteredOrders.length === 0 ? (
                    <OrdersEmpty filtered />
                ) : (
                    groupedOrders.map(({ label, orders: groupOrders }) => (
                        <section key={label} className="space-y-3 sm:space-y-4">
                            <p className="px-0.5 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 sm:py-2 sm:text-[15px]">
                                {label}
                            </p>
                            <div className={ORDERS_GRID}>
                                {groupOrders.map((order) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>

            {filterOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 dark:bg-black/70"
                        style={{ opacity: filterVisible ? 1 : 0 }}
                        onClick={closeFilter}
                        aria-hidden
                    />

                    <div
                        role="dialog"
                        aria-modal
                        aria-label="فلتر"
                        dir="rtl"
                        className="fixed inset-x-0 bottom-18 z-50 mx-auto max-w-lg rounded-t-[20px] bg-white px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl dark:bg-gray-900 sm:max-w-2xl sm:px-5 md:max-w-xl lg:max-w-2xl"
                        style={{
                            transform: filterVisible ? "translateY(0)" : "translateY(100%)",
                            transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                        }}
                    >
                        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200 dark:bg-gray-700" />

                        <div className="relative mb-6 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={closeFilter}
                                aria-label="إغلاق"
                                className="absolute start-0 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors active:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:text-gray-300 dark:active:bg-gray-700 sm:h-9 sm:w-9"
                            >
                                <X className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} aria-hidden />
                            </button>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-[16px]">فلتر</h2>
                        </div>

                        <div className="mb-5">
                            <p className="mb-3 text-[13px] font-semibold text-gray-800 dark:text-gray-200">الفترة الزمنية</p>
                            <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-4">
                                <input
                                    type="date"
                                    value={draftFilter.date}
                                    max={todayStr()}
                                    onChange={(e) =>
                                        setDraftFilter((prev) => ({
                                            ...prev,
                                            date: e.target.value,
                                            timePeriod: null,
                                        }))
                                    }
                                    aria-label="اختر التاريخ"
                                    className="min-h-10 flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500 sm:text-[15px]"
                                    dir="ltr"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {TIME_CHIPS.map((chip) => {
                                    const isActive = draftFilter.timePeriod === chip;
                                    return (
                                        <button
                                            key={chip}
                                            type="button"
                                            aria-pressed={isActive}
                                            onClick={() =>
                                                setDraftFilter((prev) => ({
                                                    ...prev,
                                                    timePeriod: isActive ? null : chip,
                                                    date: "",
                                                }))
                                            }
                                            className={[
                                                FILTER_CHIP,
                                                isActive
                                                    ? "bg-[#30913F] text-white"
                                                    : "border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
                                            ].join(" ")}
                                        >
                                            {chip}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="mb-3 text-[13px] font-semibold text-gray-800 dark:text-gray-200">حالة الأوردر</p>
                            <div className="flex flex-wrap gap-2 sm:gap-2.5">
                                {STATUS_CHIPS.map(({ id, label }) => {
                                    const isActive = draftFilter.statuses.includes(id);
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            aria-pressed={isActive}
                                            onClick={() => toggleStatus(id)}
                                            className={[
                                                FILTER_CHIP,
                                                isActive
                                                    ? "bg-[#30913F] text-white"
                                                    : "border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300",
                                            ].join(" ")}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={applyFilter}
                                className="h-12 w-full rounded-xl bg-[#30913F] text-sm font-semibold text-white transition-colors active:bg-[#267332] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 sm:text-[15px]"
                            >
                                تطبيق
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setDraftFilter(EMPTY_FILTER);
                                    setAppliedFilter(EMPTY_FILTER);
                                    closeFilter();
                                }}
                                className="h-12 w-full rounded-xl bg-[#F6F6F6] text-sm font-semibold text-[#43474F] transition-colors hover:bg-[#ECECEC] active:bg-[#E5E5E5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:text-[15px]"
                            >
                                إعادة الضبط
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

// ── OrderCard ─────────────────────────────────────────────────────────────────

const OrderCard = memo(function OrderCard({ order }: { order: ApiOrder }) {
    const statusInfo = STATUS_STYLES[order.order_status] ?? {
        bg: "bg-gray-100 dark:bg-gray-800",
        text: "text-gray-500 dark:text-gray-400",
        label: order.order_status,
    };
    const storeName = order.store?.name ?? "—";
    const logoUrl = order.store?.logo_full_url;
    const amount = order.order_amount != null
        ? `${order.order_amount} ج.م`
        : 0;

    return (
        <Link
            href={`/my-orders/${order.id}`}
            aria-label={`طلب ${storeName} رقم ${order.id}`}
            className="flex h-full min-w-0 flex-row-reverse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 dark:bg-gray-800 dark:ring-white/[0.06] dark:focus-visible:ring-offset-gray-950"
        >
            <div className="flex w-16 shrink-0 items-center justify-center self-stretch sm:w-[4.5rem] md:w-20">
                <ChevronLeft className="h-6 w-6 text-gray-400 dark:text-gray-500 sm:h-7 sm:w-7 md:h-8 md:w-8" strokeWidth={1.4} aria-hidden />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-3 py-3 sm:gap-2 sm:px-4 sm:py-3.5">
                <div className="flex items-center justify-between gap-2">
                    <p className="min-w-0 truncate text-start text-[13px] font-semibold text-gray-900 dark:text-gray-50 sm:text-sm">{storeName}</p>
                    <p className="shrink-0 text-[12px] font-semibold text-gray-500 dark:text-gray-400 sm:text-[13px]">#{order.id}</p>
                </div>

                <span
                    className={[
                        "w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs",
                        statusInfo.bg,
                        statusInfo.text,
                    ].join(" ")}
                >
                    {statusInfo.label}
                </span>

                <div className="flex min-w-0 items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-gray-500 dark:text-gray-400 sm:h-[13px] sm:w-[13px]" strokeWidth={1.6} aria-hidden />
                    <span className="truncate text-xs font-medium text-gray-600 dark:text-gray-300 sm:text-[13px]">
                        تاريخ الطلب: {order.order_time}
                    </span>
                </div>

                <p className="text-start text-[13px] font-semibold text-gray-900 dark:text-gray-50 sm:text-sm">
                    إجمالي التكلفة: {amount}
                </p>
            </div>

            <div className="flex w-16 shrink-0 items-center justify-center self-stretch sm:w-[4.5rem] md:w-20">
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt={storeName}
                        width={56}
                        height={56}
                        className="h-11 w-11 rounded-xl object-cover sm:h-12 sm:w-12 md:h-14 md:w-14"
                    />
                ) : (
                    <Store className="h-7 w-7 text-gray-300 dark:text-gray-500 sm:h-8 sm:w-8" strokeWidth={1.4} aria-hidden />
                )}
            </div>
        </Link>
    );
});
