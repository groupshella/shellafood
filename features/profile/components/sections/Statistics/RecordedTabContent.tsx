"use client";

import { ArrowUp, Calendar, Clock, TrendingUp } from "lucide-react";

import { TAJAWAL } from "@/features/profile/constants/statistics.constants";
import type { useRecordedAnalytics } from "@/features/profile/hooks/useRecordedAnalytics";
import { CategoryCard } from "./CategoryCard";
import { BalanceStatCard } from "./qidha/BalanceStatCard";
import { DuePaymentCard } from "./qidha/DuePaymentCard";
import { MonthTrendCard } from "./qidha/MonthTrendCard";
import { QidhaSpendingCard } from "./qidha/QidhaSpendingCard";
import { EmptySectionCard } from "./shared/EmptySectionCard";
import { ErrorSectionCard } from "./shared/ErrorSectionCard";
import { SarIcon } from "./shared/SarIcon";
import { SectionTitle } from "./shared/SectionTitle";
import { SkeletonBlock } from "./shared/SkeletonBlock";

function formatTransactionDate(iso: string, isArabic: boolean): string {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

export function RecordedTabContent({
	recorded,
	isArabic,
}: {
	recorded: ReturnType<typeof useRecordedAnalytics>;
	isArabic: boolean;
}) {
	const {
		qidha,
		categories,
		monthlyTrends,
		salaryDay,
		transactions,
		status,
		retry,
	} = recorded;

	const amount = (value?: string) => value || "00.00";
	const count = (value?: number) => String(value ?? 0);

	const isEmptyShell =
		qidha.availableBalance === "00.00" &&
		qidha.usedBalance === "00.00" &&
		categories.length === 0 &&
		monthlyTrends.length === 0;

	if (status === "loading" && isEmptyShell) {
		return (
			<div className="flex flex-col gap-5 sm:gap-6 md:gap-7">
				<SkeletonBlock className="h-40 w-full rounded-[20px] sm:h-44" />
				<div className="grid grid-cols-3 gap-2 sm:gap-3">
					<SkeletonBlock className="h-24" />
					<SkeletonBlock className="h-24" />
					<SkeletonBlock className="h-24" />
				</div>
				<SkeletonBlock className="h-28" />
			</div>
		);
	}

	if (status === "error" && isEmptyShell) {
		return (
			<ErrorSectionCard
				message={
					isArabic
						? "تعذّر تحميل إحصائيات قيدها"
						: "Could not load Qidha statistics"
				}
				onRetry={retry}
				isArabic={isArabic}
			/>
		);
	}

	return (
		<div className="flex flex-col gap-5 sm:gap-6 md:gap-7 lg:gap-8">
			{/* Hero balance — decorative brand gradient kept as illustration */}
			<div
				className="relative w-full overflow-hidden rounded-2xl shadow-[0px_4px_16px_rgba(48,145,63,0.22)] sm:rounded-[1.25rem] lg:rounded-3xl"
				style={{
					background:
						"linear-gradient(135deg, #1E7A2C 0%, #30913F 45%, #3EC856 100%)",
				}}
			>
				<div className="pointer-events-none absolute -start-8 -top-10 h-[140px] w-[140px] rounded-full bg-white/10" />
				<div className="pointer-events-none absolute -end-6 bottom-[-40px] h-[160px] w-[160px] rounded-full bg-white/[0.06]" />

				<div className="relative flex min-h-[160px] flex-col gap-4 px-4 py-5 sm:min-h-[168px] sm:px-5 sm:py-6 md:px-6 lg:min-h-[180px]">
					<div className="flex items-start justify-between gap-3">
						<div className="flex min-w-0 flex-col items-start gap-1">
							<span
								className="text-[13px] font-medium text-white/75 sm:text-sm"
								style={TAJAWAL}
							>
								{isArabic ? "الرصيد المتاح" : "Available balance"}
							</span>
							<div className="flex flex-wrap items-center gap-1.5 text-white">
								<span
									className="text-[clamp(28px,7vw,40px)] font-extrabold leading-none tracking-[-0.5px]"
									style={TAJAWAL}
								>
									{amount(qidha.availableBalance)}
								</span>
								<SarIcon
									width={20}
									height={22.4}
									className="text-white"
								/>
							</div>
						</div>

						<div className="flex h-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/20 px-3.5 sm:h-9 sm:px-4">
							<span
								className="text-xs font-medium text-white sm:text-[13px]"
								style={TAJAWAL}
							>
								{qidha.statusLabel}
							</span>
						</div>
					</div>

					<div className="mt-auto flex flex-wrap items-center justify-between gap-2">
						<div className="flex items-center gap-1.5">
							<span className="h-1.5 w-1.5 rounded-full bg-[#A8F5B8]" />
							<span
								className="text-[11px] font-normal text-[#D1FDD2] sm:text-xs"
								style={TAJAWAL}
							>
								{isArabic
									? `مستخدم ${qidha.usedPercentage.toFixed(1)}% من الحد`
									: `${qidha.usedPercentage.toFixed(1)}% of limit used`}
							</span>
						</div>
						{status === "error" && (
							<button
								type="button"
								onClick={retry}
								className="text-[11px] font-semibold text-white underline-offset-2 hover:underline sm:text-xs"
							>
								{isArabic ? "إعادة المحاولة" : "Retry"}
							</button>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
				<BalanceStatCard
					label={isArabic ? "إجمالي الرصيد" : "Total balance"}
					amount={amount(qidha.totalBalance)}
					sublabel={isArabic ? "الرصيد الإجمالي" : "Overall balance"}
				/>
				<BalanceStatCard
					label={isArabic ? "الحد الائتماني" : "Credit limit"}
					amount={amount(qidha.creditLimit)}
					sublabel={
						isArabic ? "الحد الأقصى المسموح" : "Maximum allowed"
					}
				/>
				<BalanceStatCard
					label={isArabic ? "الرصيد المستخدم" : "Used balance"}
					amount={amount(qidha.usedBalance)}
					sublabel={
						isArabic ? "المبلغ المنفق حتى الاَن" : "Amount spent so far"
					}
				/>
			</div>

			<section className="flex flex-col gap-3 sm:gap-4">
				<SectionTitle>
					{isArabic ? "تحليل الإنفاق" : "Spending analysis"}
				</SectionTitle>
				<div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
					<QidhaSpendingCard
						label={
							isArabic
								? "إجمالي الإنفاق هذا الشهر"
								: "Total spending this month"
						}
						amount={amount(qidha.monthlyTotal)}
						iconBg="#EBFEEB"
						icon={
							<TrendingUp
								className="h-3.5 w-3.5 text-brand sm:h-4 sm:w-4"
								strokeWidth={2.5}
							/>
						}
					/>
					<QidhaSpendingCard
						label={
							isArabic ? "متوسط الإنفاق اليومي" : "Daily average spending"
						}
						amount={amount(qidha.dailyAverage)}
						iconBg="#EFE6FF"
						icon={
							<Calendar
								className="h-3.5 w-3.5 text-[#7861A6] sm:h-4 sm:w-4"
								strokeWidth={2}
							/>
						}
					/>
					<QidhaSpendingCard
						label={
							isArabic ? "أعلى عملية شراء" : "Highest purchase"
						}
						amount={amount(qidha.highestPurchase)}
						iconBg="#EBFEEB"
						icon={
							<ArrowUp
								className="h-3.5 w-3.5 text-brand sm:h-4 sm:w-4"
								strokeWidth={2.5}
							/>
						}
					/>
				</div>
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<SectionTitle>
					{isArabic ? "فئات الإنفاق" : "Spending categories"}
				</SectionTitle>
				<div className="flex flex-col gap-2.5 sm:gap-3 md:grid md:grid-cols-2 md:gap-4">
					{categories.length > 0 ? (
						categories.map((category) => (
							<CategoryCard
								key={category.id}
								category={category}
								isArabic={isArabic}
							/>
						))
					) : (
						<div className="md:col-span-2">
							<EmptySectionCard>
								{isArabic
									? "لا توجد فئات لعرضها حتى الأن"
									: "No categories to show yet"}
							</EmptySectionCard>
						</div>
					)}
				</div>
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<SectionTitle>
					{isArabic ? "الاتجاهات الشهرية" : "Monthly trends"}
				</SectionTitle>
				{monthlyTrends.length > 0 ? (
					<div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-1 sm:gap-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{monthlyTrends.map((trend) => (
							<MonthTrendCard
								key={trend.month}
								trend={trend}
								isEmpty={Number(trend.total) === 0}
								isArabic={isArabic}
							/>
						))}
					</div>
				) : (
					<EmptySectionCard>
						{isArabic
							? "لا توجد إحصائيات لعرضها حتى الأن"
							: "No statistics to show yet"}
					</EmptySectionCard>
				)}
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<SectionTitle>
					{isArabic
						? "يوم الراتب والمدفوعات الشهرية"
						: "Salary day and monthly payments"}
				</SectionTitle>
				{salaryDay ? (
					<div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] sm:gap-4 sm:px-5 sm:py-4 md:max-w-xl lg:max-w-2xl">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[#EFE6FF] sm:h-12 sm:w-12">
							<Calendar
								className="h-6 w-6 text-[#7861A6]"
								strokeWidth={1.75}
							/>
						</div>
						<div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
							<span
								className="text-[11px] font-medium text-muted sm:text-xs"
								style={TAJAWAL}
							>
								{isArabic ? "يوم الراتب" : "Salary day"}
							</span>
							<span
								className="text-[15px] font-bold text-foreground sm:text-base"
								style={TAJAWAL}
							>
								{isArabic
									? `${salaryDay.salaryDay} من كل شهر`
									: `${salaryDay.salaryDay} of every month`}
							</span>
							<div
								className="flex h-[26px] items-center gap-1 rounded-full px-2.5 sm:h-7 sm:px-3"
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
									className="text-xs font-bold text-white"
									style={TAJAWAL}
								>
									{isArabic
										? `بعد ${salaryDay.daysUntilSalary} يوم`
										: `In ${salaryDay.daysUntilSalary} days`}
								</span>
							</div>
						</div>
					</div>
				) : (
					<EmptySectionCard>
						{isArabic
							? "لا توجد بيانات ليوم الراتب"
							: "No salary day data"}
					</EmptySectionCard>
				)}
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<div className="flex items-center justify-between gap-3">
					<SectionTitle>
						{isArabic ? "المدفوعات المستحقة" : "Due payments"}
					</SectionTitle>
					<div className="flex shrink-0 items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1">
						<SarIcon
							width={12}
							height={13.4}
							className="text-red-600"
						/>
						<span
							className="text-[15px] font-bold text-red-500 sm:text-base"
							style={TAJAWAL}
						>
							{amount(qidha.dueTotal)}
						</span>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:max-w-xl md:gap-4 lg:max-w-2xl">
					<DuePaymentCard
						label={isArabic ? "المعلقة" : "Pending"}
						count={count(qidha.pendingCount)}
						bg="#FDF1DA"
						textColor="#ED9206"
						iconBg="#EFAD4F"
					/>
					<DuePaymentCard
						label={isArabic ? "المتأخرة" : "Overdue"}
						count={count(qidha.overdueCount)}
						bg="#FFDCDC"
						textColor="#DB2626"
						iconBg="#DB2626"
					/>
				</div>

				<div className="flex min-h-14 w-full flex-wrap items-center justify-between gap-2 rounded-xl bg-card px-4 py-3 sm:min-h-16 sm:px-5 md:max-w-xl lg:max-w-2xl">
					<span
						className="text-xs font-bold text-muted sm:text-[13px]"
						style={TAJAWAL}
					>
						{isArabic ? "المبلغ المستحق" : "Amount due"}
					</span>
					<div className="flex flex-wrap items-center gap-1 text-foreground">
						<span
							className="text-base font-bold tabular-nums sm:text-[17px]"
							style={TAJAWAL}
						>
							{amount(qidha.dueTotal)}
						</span>
						<span
							className="text-[13px] font-bold sm:text-sm"
							style={TAJAWAL}
						>
							{isArabic ? "/ مدفوع" : "/ paid"}
						</span>
						<span
							className="text-base font-bold tabular-nums sm:text-[17px]"
							style={TAJAWAL}
						>
							{amount(qidha.paidTotal)}
						</span>
					</div>
				</div>
			</section>

			<section className="flex flex-col gap-3 sm:gap-4">
				<SectionTitle>
					{isArabic ? "آخر المعاملات" : "Recent transactions"}
				</SectionTitle>
				{transactions.length > 0 ? (
					<div className="flex flex-col gap-2.5 sm:gap-3 md:grid md:grid-cols-2 md:gap-4">
						{transactions.slice(0, 6).map((tx) => (
							<div
								key={tx.id}
								className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-3.5 py-3 shadow-[0px_1px_8px_rgba(0,0,0,0.04)] sm:px-4 sm:py-3.5"
							>
								<div className="min-w-0 flex-1 text-start">
									<p
										className="truncate text-sm font-bold text-foreground sm:text-[15px]"
										style={TAJAWAL}
									>
										{tx.storeName}
									</p>
									<p
										className="mt-0.5 text-[11px] text-muted sm:text-xs"
										style={TAJAWAL}
									>
										{formatTransactionDate(tx.createdAt, isArabic)}
									</p>
								</div>
								<span
									className={[
										"shrink-0 text-sm font-bold tabular-nums sm:text-base",
										tx.type === "credit"
											? "text-brand"
											: "text-red-500",
									].join(" ")}
									style={TAJAWAL}
								>
									{tx.type === "credit" ? "+" : "-"}
									{tx.amount}
								</span>
							</div>
						))}
					</div>
				) : (
					<EmptySectionCard>
						{isArabic
							? "لا توجد معاملات حتى الأن"
							: "No transactions yet"}
					</EmptySectionCard>
				)}
			</section>
		</div>
	);
}
