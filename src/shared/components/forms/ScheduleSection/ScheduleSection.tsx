"use client";
import { BookingServiceType, TIME_SLOTS } from "@/features/serve-me";
interface ScheduleSectionProps
{
    isArabic:boolean;
    serviceType:BookingServiceType;
    date:string;
    time:string;
    handleServiceTypeChange:(type:BookingServiceType)=>void;
    handleTimeSelect:(time:string)=>void;
    handleDateSelect:(e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function ScheduleSection({isArabic,serviceType,date,time,handleServiceTypeChange,handleTimeSelect,handleDateSelect}:ScheduleSectionProps)
{
    return <><section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
        {isArabic ? "نوع الخدمة" : "Service Type"}
    </h2>
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
            type="button"
            onClick={() => handleServiceTypeChange("instant")}
            className={`p-4 rounded-lg border-2 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
                serviceType === "instant"
                    ? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
            }`}
        >
            <span className="text-sm sm:text-base">{isArabic ? "فوري" : "Instant"}</span>
        </button>
        <button
            type="button"
            onClick={() => handleServiceTypeChange("scheduled")}
            className={`p-4 rounded-lg border-2 transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
                serviceType === "scheduled"
                    ? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
            }`}
        >
            <span className="text-sm sm:text-base">{isArabic ? "مجدول" : "Scheduled"}</span>
        </button>
    </div>
</section>

{/* Date & Time (only for scheduled) */}
{serviceType === "scheduled" && (
    <>
        <section className="border-t border-gray-200 dark:border-gray-700 pt-6 sm:pt-8 lg:pt-10 pb-6 sm:pb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6">
                {isArabic ? "التاريخ والوقت" : "Date & Time"}
            </h2>
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        {isArabic ? "التاريخ" : "Date"}
                    </label>
                    <input
                        type="date"
                        name="date"
                        value={date}
                        onChange={handleDateSelect}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:border-green-600 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500/20 focus:ring-offset-2 focus:outline-none transition-all text-base touch-manipulation"
                    />
                </div>
                <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        {isArabic ? "الوقت" : "Time"}
                    </label>
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3">
                        {TIME_SLOTS.map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => handleTimeSelect(slot)}
                                className={`py-3 px-4 rounded-lg border-2 transition-all text-sm touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 ${
                                time === slot
                                        ? "border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold"
                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 active:border-gray-300 text-gray-700 dark:text-gray-300"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    </>
)}</>
}