"use client";

import { Phone } from "lucide-react";

interface ContractStepProps {
	onViewContract: () => void;
	onCheckStatus: () => void;
	onVerify: () => void;
	isArabic: boolean;
}

const NAFATH_CODE = 54;
const CIRCLE_RADIUS = 70;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const PROGRESS = 0.75;

const CONTRACT_TEXT = {
	ar: `أهلاً بك في عائلة قيدها، ونهنئك على وصولك للخطوة النهائية في رحلة انضمامك!
يسعدنا خدمتك في هذه المرحلة الحاسمة، وهي توثيق العقد الرسمي عبر منصة "نفاذ".
تسهيل الأمر عليك، أمامك الآن خياران لإتمام العملية:
1. الخيار الأول (موصى به): مراجعة العقد ثم التوثيق إذا كنت ترغب في الاطلاع على كافة تفاصيل وبنود العقد قبل أي التزام قانوني، يرجى اتباع الخطوات التالية:
• أولا: اضغط على أيقونة "الاطلاع على العقد" لمراجعته بعناية.
• ثانياً: بعد الانتهاء من المراجعة، اتبع خطوات التوثيق التالية:
• أ. اضغط على زر "التوثيق".
• ب. ستحصل على رمز التحقق عبر الرسائل النصية.
ب. سيظهر أمامك رقم محدد للعملية.
• ج. افتح تطبيق "نفاذ" في هاتفك واختر الطلب الذي يحمل نفس الرقم.
- د. وافق على الطلب لإتمام المصادقة.`,
	en: `Welcome to the Qidha family, and congratulations on reaching the final step of your onboarding journey!
We are happy to assist you at this critical stage: authenticating the official contract through the Nafath platform.
To make things easier, you now have two options to complete the process:
1. First option (recommended): Review the contract, then authenticate. If you would like to review all contract details and terms before any legal commitment, please follow these steps:
• First: Tap "View contract" to review it carefully.
• Second: After reviewing, follow these authentication steps:
• a. Tap the "Authenticate" button.
• b. You will receive a verification code via SMS.
• c. A specific number for the process will appear.
• d. Open the Nafath app on your phone and select the request with the same number.
• e. Approve the request to complete authentication.`,
} as const;

export function ContractStep({
	onViewContract,
	onCheckStatus,
	onVerify,
	isArabic,
}: ContractStepProps) {
	return (
		<div className="grid grid-cols-1 gap-4 pb-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] lg:items-start">
			<div className="rounded-2xl bg-background p-3 sm:p-4">
				<h2 className="mb-4 text-center text-[16px] font-bold text-muted sm:text-[17px]">
					{isArabic ? "كود تطبيق نفاذ" : "Nafath app code"}
				</h2>
				<div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:p-6">
					<svg
						className="h-40 w-40 sm:h-[178px] sm:w-[178px]"
						viewBox="0 0 178 178"
						aria-label={
							isArabic
								? `كود نفاذ: ${NAFATH_CODE}`
								: `Nafath code: ${NAFATH_CODE}`
						}
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
						<circle
							cx="89"
							cy="89"
							r={CIRCLE_RADIUS}
							fill="none"
							stroke="currentColor"
							className="text-border"
							strokeWidth="12"
						/>
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
					<p className="text-center text-[14px] font-bold text-foreground sm:text-[15px]">
						{isArabic
							? "قم بأدخال هذا الكود إلى تطبيق نفاذ"
							: "Enter this code in the Nafath app"}
					</p>
				</div>
			</div>

			<div className="rounded-2xl bg-card p-4 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:p-5">
				<p className="whitespace-pre-line text-start text-[14px] font-bold leading-[180%] text-foreground sm:text-[15px]">
					{isArabic ? CONTRACT_TEXT.ar : CONTRACT_TEXT.en}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3">
				<button
					type="button"
					onClick={onViewContract}
					className="min-h-[48px] w-full rounded-xl bg-brand px-4 text-[16px] font-bold text-brand-foreground transition-opacity active:brightness-95 sm:min-h-[52px]"
				>
					{isArabic
						? "استعراض العقد قبل التوقيع"
						: "Review contract before signing"}
				</button>
				<button
					type="button"
					onClick={onCheckStatus}
					className="min-h-[50px] w-full rounded-xl bg-card px-4 text-[16px] font-bold text-foreground transition-opacity active:brightness-95 sm:min-h-[52px]"
				>
					{isArabic ? "تحقق من الحالة" : "Check status"}
				</button>
				<button
					type="button"
					onClick={onVerify}
					className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-card px-4 text-[16px] font-bold text-foreground transition-opacity active:brightness-95 sm:col-span-2 sm:min-h-[52px] lg:col-span-1"
				>
					<Phone
						className="h-6 w-6 text-foreground"
						strokeWidth={1.5}
						aria-hidden
					/>
					<span>
						{isArabic ? "التحقق من المصادقة" : "Verify authentication"}
					</span>
				</button>
			</div>
		</div>
	);
}
