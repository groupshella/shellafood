"use client";

import { Phone } from "lucide-react";

interface ContractStepProps {
    onViewContract: () => void;
    onCheckStatus: () => void;
    onVerify: () => void;
}

const NAFATH_CODE = 54;
const CIRCLE_RADIUS = 70;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const PROGRESS = 0.75;

const CONTRACT_TEXT = `أهلاً بك في عائلة قيدها، ونهنئك على وصولك للخطوة النهائية في رحلة انضمامك!
يسعدنا خدمتك في هذه المرحلة الحاسمة، وهي توثيق العقد الرسمي عبر منصة "نفاذ".
تسهيل الأمر عليك، أمامك الآن خياران لإتمام العملية:
1. الخيار الأول (موصى به): مراجعة العقد ثم التوثيق إذا كنت ترغب في الاطلاع على كافة تفاصيل وبنود العقد قبل أي التزام قانوني، يرجى اتباع الخطوات التالية:
• أولا: اضغط على أيقونة "الاطلاع على العقد" لمراجعته بعناية.
• ثانياً: بعد الانتهاء من المراجعة، اتبع خطوات التوثيق التالية:
• أ. اضغط على زر "التوثيق".
• ب. ستحصل على رمز التحقق عبر الرسائل النصية.
ب. سيظهر أمامك رقم محدد للعملية.
• ج. افتح تطبيق "نفاذ" في هاتفك واختر الطلب الذي يحمل نفس الرقم.
- د. وافق على الطلب لإتمام المصادقة.`;

export function ContractStep({ onViewContract, onCheckStatus, onVerify }: ContractStepProps) {
    return (
        <div className="grid grid-cols-1 gap-4 pb-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] lg:items-start">
            {/* Nafath Code Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-3 dark:bg-gray-800/50 sm:p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555] dark:text-gray-400">
                    كود تطبيق نفاذ
                </h2>
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:p-6">
                    {/* Circular gauge */}
                    <svg
                        className="h-40 w-40 sm:h-[178px] sm:w-[178px]"
                        viewBox="0 0 178 178"
                        aria-label={`كود نفاذ: ${NAFATH_CODE}`}
                    >
                        <defs>
                            <linearGradient
                                id="nafathGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop offset="0%" stopColor="#5BC467" />
                                <stop offset="100%" stopColor="#237D2D" />
                            </linearGradient>
                        </defs>
                        {/* Track */}
                        <circle
                            cx="89"
                            cy="89"
                            r={CIRCLE_RADIUS}
                            fill="none"
                            stroke="#E8ECEF"
                            strokeWidth="12"
                        />
                        {/* Progress arc */}
                        <circle
                            cx="89"
                            cy="89"
                            r={CIRCLE_RADIUS}
                            fill="none"
                            stroke="url(#nafathGradient)"
                            strokeWidth="12"
                            strokeDasharray={`${CIRCLE_CIRCUMFERENCE * PROGRESS} ${CIRCLE_CIRCUMFERENCE * (1 - PROGRESS)}`}
                            strokeLinecap="round"
                            transform="rotate(-90 89 89)"
                        />
                        {/* Code number */}
                        <text
                            x="89"
                            y="89"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fontSize="52"
                            fontWeight="700"
                            fill="#237D2D"
                            fontFamily="system-ui, sans-serif"
                        >
                            {NAFATH_CODE}
                        </text>
                    </svg>
                    <p className="text-center text-[14px] font-bold text-[#111B18] dark:text-gray-100">
                        قم بأدخال هذا الكود إلى تطبيق نفاذ
                    </p>
                </div>
            </div>

            {/* Contract instructions card */}
            <div className="rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] dark:bg-gray-900 dark:shadow-[0px_4px_8.9px_rgba(0,0,0,0.2)] sm:p-5">
                <p
                    className="whitespace-pre-line text-end text-[14px] font-bold leading-[180%] text-[#111B18] dark:text-gray-200 sm:text-[15px]"
                    dir="rtl"
                >
                    {CONTRACT_TEXT}
                </p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
                <button
                    type="button"
                    onClick={onViewContract}
                    className="min-h-[48px] w-full rounded-xl bg-[#30913F] px-4 text-[16px] font-bold text-white active:bg-[#267332] sm:min-h-[52px]"
                >
                    استعراض العقد قبل التوقيع
                </button>
                <button
                    type="button"
                    onClick={onCheckStatus}
                    className="min-h-[50px] w-full rounded-xl bg-[#F6F6F6] px-4 text-[16px] font-bold text-[#43474F] active:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:active:bg-gray-700"
                >
                    تحقق من الحالة
                </button>
                <button
                    type="button"
                    onClick={onVerify}
                    className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#F6F6F6] px-4 text-[16px] font-bold text-[#43474F] active:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:active:bg-gray-700 sm:col-span-2 lg:col-span-1"
                >
                    <Phone
                        className="h-6 w-6 text-[#43474F] dark:text-gray-300"
                        strokeWidth={1.5}
                    />
                    <span>التحقق من المصادقة</span>
                </button>
            </div>
        </div>
    );
}
