"use client";

import { ArrowUp, Calendar, Clock, TrendingUp } from "lucide-react";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type {
    QidhaStatisticsData,
    StatisticsCategory,
    StatisticsMonthTrend,
} from "@/features/profile/types/statistics.types";
import { CategoryCard } from "./CategoryCard";
import { BalanceStatCard } from "./qidha/BalanceStatCard";
import { DuePaymentCard } from "./qidha/DuePaymentCard";
import { MonthTrendCard } from "./qidha/MonthTrendCard";
import { QidhaSpendingCard } from "./qidha/QidhaSpendingCard";
import { EmptySectionCard } from "./shared/EmptySectionCard";
import { SarIcon } from "./shared/SarIcon";
import { SectionTitle } from "./shared/SectionTitle";

export function RecordedTabContent({
    qidha,
    categories,
    monthlyTrends,
}: {
    qidha?: QidhaStatisticsData;
    categories: StatisticsCategory[];
    monthlyTrends: StatisticsMonthTrend[];
}) {
    const hasQidhaData = Boolean(qidha);
    const hasCategories = categories.length > 0;
    const hasTrends = monthlyTrends.length > 0;
    const qidhaAmount = (value?: string) =>
        hasQidhaData && value ? value : "00.00";
    const qidhaCount = (value?: number) =>
        hasQidhaData ? String(value ?? 0) : "0";

    return (
        <div className="flex flex-col gap-5">
            {/* Hero balance card */}
            <div
                className="relative w-full overflow-hidden rounded-[20px] shadow-[0px_4px_16px_rgba(48,145,63,0.22)]"
                style={{
                    background:
                        "linear-gradient(135deg, #1E7A2C 0%, #30913F 45%, #3EC856 100%)",
                }}
            >
                <div className="pointer-events-none absolute -start-8 -top-10 h-[140px] w-[140px] rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -end-6 bottom-[-40px] h-[160px] w-[160px] rounded-full bg-white/[0.06]" />

                <div className="relative flex min-h-[168px] flex-col gap-4 px-5 py-5">
                    <div className="flex items-start justify-between gap-3">
                        {/* First in RTL = start/right: balance */}
                        <div className="flex min-w-0 flex-col items-start gap-1">
                            <span
                                className="text-[13px] font-medium text-white/75"
                                style={TAJAWAL}
                            >
                                الرصيد المتاح
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 text-white">
                                <span
                                    className="text-[clamp(30px,8vw,38px)] font-extrabold leading-none tracking-[-0.5px]"
                                    style={TAJAWAL}
                                >
                                    {qidhaAmount(qidha?.availableBalance)}
                                </span>
                                <SarIcon
                                    width={20}
                                    height={22.4}
                                    className="text-white"
                                />
                            </div>
                        </div>

                        {/* Second in RTL = end/left: status badge */}
                        <div className="flex h-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/20 px-3.5">
                            <span
                                className="text-[12px] font-medium text-white"
                                style={TAJAWAL}
                            >
                                نشط
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#A8F5B8]" />
                        <span
                            className="text-[11px] font-normal text-[#D1FDD2]"
                            style={TAJAWAL}
                        >
                            آخر تحديث قبل دقيقة
                        </span>
                    </div>
                </div>
            </div>

            {/* Secondary balance stats */}
            <div className="grid grid-cols-3 gap-2">
                <BalanceStatCard
                    label="إجمالي الرصيد"
                    amount={qidhaAmount(qidha?.totalBalance)}
                    sublabel="الرصيد الإجمالي"
                />
                <BalanceStatCard
                    label="الحد الائتماني"
                    amount={qidhaAmount(qidha?.creditLimit)}
                    sublabel="الحد الأقصى المسموح"
                />
                <BalanceStatCard
                    label="الرصيد المستخدم"
                    amount={qidhaAmount(qidha?.usedBalance)}
                    sublabel="المبلغ المنفق حتى الاَن"
                />
            </div>

            {/* Spending analysis */}
            <section className="flex flex-col gap-3">
                <SectionTitle>تحليل الإنفاق</SectionTitle>
                <div className="grid grid-cols-3 gap-2">
                    <QidhaSpendingCard
                        label="إجمالي الإنفاق هذا الشهر"
                        amount={qidhaAmount(qidha?.monthlyTotal)}
                        iconBg="#EBFEEB"
                        icon={
                            <TrendingUp
                                className="h-3.5 w-3.5 text-[#30913F]"
                                strokeWidth={2.5}
                            />
                        }
                    />
                    <QidhaSpendingCard
                        label="متوسط الإنفاق اليومي"
                        amount={qidhaAmount(qidha?.dailyAverage)}
                        iconBg="#EFE6FF"
                        icon={
                            <Calendar
                                className="h-3.5 w-3.5 text-[#7861A6]"
                                strokeWidth={2}
                            />
                        }
                    />
                    <QidhaSpendingCard
                        label="أعلى عملية شراء"
                        amount={qidhaAmount(qidha?.highestPurchase)}
                        iconBg="#EBFEEB"
                        icon={
                            <ArrowUp
                                className="h-3.5 w-3.5 text-[#30913F]"
                                strokeWidth={2.5}
                            />
                        }
                    />
                </div>
            </section>

            {/* Categories */}
            <section className="flex flex-col gap-3">
                <SectionTitle>فئات الإنفاق</SectionTitle>
                <div className="flex flex-col gap-2.5">
                    {hasCategories ? (
                        categories.map((category) => (
                            <CategoryCard key={category.id} category={category} />
                        ))
                    ) : (
                        <EmptySectionCard>
                            لا توجد فئات لعرضها حتى الأن
                        </EmptySectionCard>
                    )}
                </div>
            </section>

            {/* Monthly trends */}
            <section className="flex flex-col gap-3">
                <SectionTitle>الاتجاهات الشهرية</SectionTitle>
                {hasTrends ? (
                    <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {monthlyTrends.map((trend) => (
                            <MonthTrendCard
                                key={trend.month}
                                trend={trend}
                                isEmpty={!hasQidhaData}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptySectionCard>
                        لا توجد إحصائيات لعرضها حتى الأن
                    </EmptySectionCard>
                )}
            </section>

            {/* Salary day */}
            <section className="flex flex-col gap-3">
                <SectionTitle>يوم الراتب والمدفوعات الشهرية</SectionTitle>
                <div className="flex w-full items-center gap-3 rounded-[14px] border border-[#F0EEF3] bg-white px-4 py-3.5 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] dark:border-gray-700 dark:bg-gray-800">
                    {/* First in RTL = right: calendar icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#EFE6FF]">
                        <Calendar
                            className="h-6 w-6 text-[#7861A6]"
                            strokeWidth={1.75}
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                        <span
                            className="text-[11px] font-medium text-[#8A8F98] dark:text-gray-400"
                            style={TAJAWAL}
                        >
                            يوم الراتب
                        </span>
                        <span
                            className="text-[15px] font-bold text-[#1F2937] dark:text-gray-100"
                            style={TAJAWAL}
                        >
                            1 من كل شهر
                        </span>
                        <div
                            className="flex h-[26px] items-center gap-1 rounded-full px-2.5"
                            style={{
                                background:
                                    "linear-gradient(99.16deg, #DFD3F5 -8.79%, #7861A6 90.77%)",
                            }}
                        >
                            <Clock
                                className="h-3.5 w-3.5 text-white"
                                strokeWidth={1.75}
                            />
                            <span
                                className="text-[12px] font-bold text-white"
                                style={TAJAWAL}
                            >
                                بعد 0 يوم
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Due payments */}
            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <SectionTitle>المدفوعات المستحقة</SectionTitle>
                    <div className="flex shrink-0 items-center gap-1 rounded-[8px] bg-[#FFDCDC] px-2.5 py-1">
                        <SarIcon
                            width={12}
                            height={13.4}
                            className="text-[#CD1625]"
                        />
                        <span
                            className="text-[15px] font-bold text-[#DB2626] sm:text-[16px]"
                            style={TAJAWAL}
                        >
                            {qidhaAmount(qidha?.dueTotal)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                    <DuePaymentCard
                        label="المعلقة"
                        count={qidhaCount(qidha?.pendingCount)}
                        bg="#FDF1DA"
                        textColor="#ED9206"
                        iconBg="#EFAD4F"
                    />
                    <DuePaymentCard
                        label="المتأخرة"
                        count={qidhaCount(qidha?.overdueCount)}
                        bg="#FFDCDC"
                        textColor="#DB2626"
                        iconBg="#DB2626"
                    />
                </div>

                <div className="flex min-h-[56px] w-full flex-wrap items-center justify-between gap-2 rounded-[12px] bg-[#F6F5F8] px-4 py-3 dark:bg-gray-800">
                    <span
                        className="text-[12px] font-bold text-[#555555] dark:text-gray-400"
                        style={TAJAWAL}
                    >
                        المبلغ المستحق
                    </span>
                    <div className="flex flex-wrap items-center gap-1 text-[#111B18] dark:text-gray-100">
                        <span
                            className="text-[16px] font-bold tabular-nums sm:text-[17px]"
                            style={TAJAWAL}
                        >
                            {qidhaAmount(qidha?.dueTotal)}
                        </span>
                        <span
                            className="text-[13px] font-bold sm:text-[14px]"
                            style={TAJAWAL}
                        >
                            من أصل
                        </span>
                        <span
                            className="text-[16px] font-bold tabular-nums sm:text-[17px]"
                            style={TAJAWAL}
                        >
                            {qidhaAmount(qidha?.paidTotal)}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
}
