"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SlidersHorizontal, X, Calendar, ShoppingBag, Store, Clock } from "lucide-react";
import type { ApiOrder, OrderStatus, FilterState, DateGroupLabel } from "@/features/my-orders/types/orders.types";

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    preparing:  { bg: "bg-amber-50",   text: "text-amber-600",  label: "تحت الإعداد" },
    confirmed:  { bg: "bg-blue-50",    text: "text-blue-600",   label: "مؤكد" },
    processing: { bg: "bg-amber-50",   text: "text-amber-600",  label: "قيد التحضير" },
    handover:   { bg: "bg-orange-50",  text: "text-orange-500", label: "جاري التسليم" },
    picked_up:  { bg: "bg-indigo-50",  text: "text-indigo-600", label: "في الطريق" },
    delivered:  { bg: "bg-emerald-50", text: "text-emerald-600",label: "تم التوصيل" },
    completed:  { bg: "bg-emerald-50", text: "text-emerald-600",label: "مكتمل" },
    cancelled:  { bg: "bg-red-50",     text: "text-red-500",    label: "ملغى" },
    canceled:   { bg: "bg-red-50",     text: "text-red-500",    label: "ملغى" },
    failed:     { bg: "bg-red-50",     text: "text-red-500",    label: "فشل" },
    expired:    { bg: "bg-gray-100",   text: "text-gray-500",   label: "منتهي" },
};

const STATUS_CHIPS: { id: OrderStatus; label: string }[] = [
    { id: "preparing",  label: "تحت الإعداد" },
    { id: "completed",  label: "مكتمل" },
    { id: "cancelled",  label: "ملغى" },
];

const TIME_CHIPS = ["اليوم", "هذا الأسبوع", "هذا الشهر"];
const EMPTY_FILTER: FilterState = { date: "", timePeriod: null, statuses: [] };

// ── Date-group helpers ────────────────────────────────────────────────────────

function todayStr() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}
function yesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}
function dateGroupLabel(orderDate: string): DateGroupLabel {
    if (orderDate === todayStr()) return "اليوم";
    if (orderDate === yesterdayStr()) return "الأمس";
    return "الأقدم";
}

const GROUP_ORDER: DateGroupLabel[] = ["اليوم", "الأمس", "الأقدم"];

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
    const [filterOpen, setFilterOpen]     = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [draftFilter, setDraftFilter]   = useState<FilterState>(EMPTY_FILTER);
    const [appliedFilter, setAppliedFilter] = useState<FilterState>(EMPTY_FILTER);

    // ── Build dynamic module tabs from data ──
    const moduleTabs = useMemo(() => {
        const seen = new Map<number, string>();
        for (const o of orders) {
            const id = getModuleId(o);
            if (!seen.has(id)) seen.set(id, getModuleName(o));
        }
        return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
    }, [orders]);

    // ── Filter & group ──
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const moduleMatch = activeModuleId === "all" || getModuleId(o) === activeModuleId;
            const statusMatch =
                appliedFilter.statuses.length === 0 ||
                appliedFilter.statuses.includes(o.order_status as OrderStatus);
            return moduleMatch && statusMatch;
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

    // ── Filter sheet handlers ──
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

    return (
        <>
            {/* ── Topbar ── */}
            <header className="sticky top-0 z-20 bg-white shadow-sm">
                <div className="relative flex items-center justify-center px-5 py-4">
                    <button
                        type="button"
                        onClick={openFilter}
                        aria-label="فلتر"
                        className="absolute left-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 transition-colors active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F]"
                    >
                        <SlidersHorizontal className="h-[18px] w-[18px] text-gray-700" strokeWidth={1.8} />
                        {hasActiveFilters && (
                            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#30913F] ring-2 ring-white" />
                        )}
                    </button>
                    <h1 className="text-[17px] font-bold text-gray-900">طلباتي</h1>
                </div>

                {/* Dynamic module tabs */}
                <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <button
                        type="button"
                        onClick={() => setActiveModuleId("all")}
                        className={[
                            "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                            activeModuleId === "all"
                                ? "bg-[#30913F] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                        ].join(" ")}
                    >
                        الكل
                    </button>
                    {moduleTabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveModuleId(tab.id)}
                            className={[
                                "shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                                activeModuleId === tab.id
                                    ? "bg-[#30913F] text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* ── Orders list ── */}
            <main className="space-y-1 px-4 py-4 pb-24">
                {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                            <ShoppingBag className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
                        </div>
                        <p className="text-base font-semibold text-gray-700">لا توجد طلبات</p>
                        <p className="mt-1 text-sm text-gray-400">لم يتم العثور على طلبات بهذه الفلاتر</p>
                    </div>
                ) : (
                    groupedOrders.map(({ label, orders: groupOrders }) => (
                        <section key={label} className="space-y-3">
                            <p className="pt-3 text-[12px] font-semibold text-gray-400 tracking-wide">
                                {label}
                            </p>
                            {groupOrders.map((order) => (
                                <OrderCard key={order.id} order={order} />
                            ))}
                        </section>
                    ))
                )}
            </main>

            {/* ── Filter bottom sheet ── */}
            {filterOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/25 transition-opacity duration-300"
                        style={{ opacity: filterVisible ? 1 : 0 }}
                        onClick={closeFilter}
                        aria-hidden
                    />

                    <div
                        role="dialog"
                        aria-modal
                        aria-label="فلتر"
                        dir="rtl"
                        className="fixed inset-x-0 bottom-18 z-50 rounded-t-[20px] bg-white px-5 pb-8 pt-3 shadow-2xl"
                        style={{
                            transform: filterVisible ? "translateY(0)" : "translateY(100%)",
                            transition: "transform 350ms cubic-bezier(0.32, 0.72, 0, 1)",
                        }}
                    >
                        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-gray-200" />

                        <div className="relative mb-6 flex items-center justify-center">
                            <button
                                type="button"
                                onClick={closeFilter}
                                aria-label="إغلاق"
                                className="absolute start-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#F6F5F8] text-gray-700 transition-colors active:bg-gray-200"
                            >
                                <X className="h-4 w-4" strokeWidth={2.5} />
                            </button>
                            <h2 className="text-[16px] font-semibold text-gray-900">فلتر</h2>
                        </div>

                        {/* Time period */}
                        <div className="mb-5">
                            <p className="mb-3 text-[13px] font-semibold text-gray-800">الفترة الزمنية</p>
                            <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                                <input
                                    type="text"
                                    placeholder="dd/mm/yyyy"
                                    value={draftFilter.date}
                                    onChange={(e) =>
                                        setDraftFilter((prev) => ({ ...prev, date: e.target.value }))
                                    }
                                    className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                                    dir="ltr"
                                />
                                <Calendar className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={1.6} />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {TIME_CHIPS.map((chip) => {
                                    const isActive = draftFilter.timePeriod === chip;
                                    return (
                                        <button
                                            key={chip}
                                            type="button"
                                            onClick={() =>
                                                setDraftFilter((prev) => ({
                                                    ...prev,
                                                    timePeriod: isActive ? null : chip,
                                                }))
                                            }
                                            className={[
                                                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                                                isActive
                                                    ? "bg-[#30913F] text-white"
                                                    : "border border-gray-200 bg-white text-gray-600",
                                            ].join(" ")}
                                        >
                                            {chip}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order status */}
                        <div className="mb-8">
                            <p className="mb-3 text-[13px] font-semibold text-gray-800">حالة الأوردر</p>
                            <div className="flex flex-wrap gap-2">
                                {STATUS_CHIPS.map(({ id, label }) => {
                                    const isActive = draftFilter.statuses.includes(id);
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => toggleStatus(id)}
                                            className={[
                                                "rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors",
                                                isActive
                                                    ? "bg-[#30913F] text-white"
                                                    : "border border-gray-200 bg-white text-gray-600",
                                            ].join(" ")}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={applyFilter}
                            className="w-full rounded-xl bg-[#30913F] py-3.5 text-[15px] font-semibold text-white transition-colors active:bg-[#267332]"
                        >
                            تم
                        </button>
                    </div>
                </>
            )}
        </>
    );
}

// ── OrderCard ─────────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: ApiOrder }) {
    const router = useRouter();
    const statusInfo = STATUS_STYLES[order.order_status] ?? {
        bg: "bg-gray-100",
        text: "text-gray-500",
        label: order.order_status,
    };
    const storeName = order.store?.name ?? "—";
    const logoUrl   = order.store?.logo_full_url;
    const amount    = order.order_amount != null
        ? `${order.order_amount} ج.م`
        : null;

    return (
        <article
            onClick={() => router.push(`/my-orders/${order.id}`)}
            className="flex cursor-pointer flex-row-reverse overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04] transition-transform active:scale-[0.99]"
        >
            {/* RIGHT — text content */}
            <div className="flex flex-1 flex-col gap-1.5 px-4 py-3.5">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-right text-[12px] text-gray-400">{storeName}</p>
                    <p className="truncate text-[15px] font-bold text-gray-900">#{order.id}</p>
                </div>

                <span
                    className={[
                        "shrink-0 w-fit rounded-full px-3 py-1 text-[11px] font-semibold",
                        statusInfo.bg,
                        statusInfo.text,
                    ].join(" ")}
                >
                    {statusInfo.label}
                </span>

                <div className="flex items-center gap-1.5">
                    <Clock className="h-[13px] w-[13px] shrink-0 text-gray-400" strokeWidth={1.6} />
                    <p className="text-[12px] text-gray-500">
                        {order.order_date} · {order.order_time}
                    </p>
                </div>

                {amount && (
                    <p className="text-right text-[14px] font-bold text-gray-900">
                        إجمالي التكلفة {amount}
                    </p>
                )}
            </div>

            {/* LEFT — store logo or placeholder */}
            <div className="flex w-[90px] shrink-0 items-center justify-center self-stretch rounded-l-2xl bg-[#F6F5F8]">
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt={storeName}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-xl object-cover"
                    />
                ) : (
                    <Store className="h-8 w-8 text-gray-300" strokeWidth={1.4} />
                )}
            </div>
        </article>
    );
}
