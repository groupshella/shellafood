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
        <div className="flex flex-col gap-4 pb-6">
            {/* Nafath Code Card */}
            <div className="rounded-2xl bg-[#F6F5F8] p-4">
                <h2 className="mb-4 text-center text-[16px] font-bold text-[#555555]">
                    كود تطبيق نفاذ
                </h2>
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                    {/* Circular gauge */}
                    <svg
                        width="178"
                        height="178"
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
                    <p className="text-center text-[14px] font-bold text-[#111B18]">
                        قم بأدخال هذا الكود إلى تطبيق نفاذ
                    </p>
                </div>
            </div>

            {/* Contract instructions card */}
            <div className="rounded-2xl bg-white p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)]">
                <p
                    className="whitespace-pre-line text-end text-[14px] font-bold leading-[180%] text-[#111B18]"
                    dir="rtl"
                >
                    {CONTRACT_TEXT}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 pt-2">
                <button
                    type="button"
                    onClick={onViewContract}
                    className="h-12 w-full rounded-xl bg-[#30913F] text-[16px] font-bold text-white active:bg-[#267332]"
                >
                    استعراض العقد قبل التوقيع
                </button>
                <button
                    type="button"
                    onClick={onCheckStatus}
                    className="h-[50px] w-full rounded-xl bg-[#F6F6F6] text-[16px] font-bold text-[#43474F] active:bg-gray-200"
                >
                    تحقق من الحالة
                </button>
                <button
                    type="button"
                    onClick={onVerify}
                    className="flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#F6F6F6] text-[16px] font-bold text-[#43474F] active:bg-gray-200"
                >
                    <Phone
                        className="h-6 w-6 text-[#43474F]"
                        strokeWidth={1.5}
                    />
                    <span>التحقق من المصادقة</span>
                </button>
            </div>
        </div>
    );
}
