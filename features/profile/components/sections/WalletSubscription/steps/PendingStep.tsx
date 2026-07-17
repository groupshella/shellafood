"use client";

import { Clock, Phone } from "lucide-react";
import Image from "@/shared/components/SecureImage";
import { WalletStepper } from "@/features/profile/components/shared/wallet/WalletStepper";

interface PendingStepProps {
	onViewContract: () => void;
	onContactSupport: () => void;
	isArabic: boolean;
}

export function PendingStep({
	onViewContract,
	onContactSupport,
	isArabic,
}: PendingStepProps) {
	return (
		<div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 py-6 sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
			<div className="flex items-center justify-center">
				<Image
					src="/profile/wallet-hourglass.png"
					alt={isArabic ? "قيد المراجعة" : "Under review"}
					width={188}
					height={196}
					className="h-auto w-40 object-contain sm:w-[188px] md:w-52"
				/>
			</div>

			<div className="flex max-w-xl flex-col items-center gap-3 px-4 xl:max-w-2xl">
				<h2 className="text-center text-[18px] font-bold text-foreground sm:text-xl">
					{isArabic
						? "طلبك قيد المراجعة النهائية"
						: "Your request is under final review"}
				</h2>
				<p className="text-center text-[15px] font-medium leading-relaxed text-foreground sm:text-[16px]">
					{isArabic
						? "سيتم تحديد الحد الائتماني وتفعيل المحفظة خلال 24 - 48 ساعة. سنقوم باشعارك فور الانتهاء."
						: "Your credit limit will be set and your wallet activated within 24–48 hours. We will notify you as soon as it is complete."}
				</p>
			</div>

			<div className="w-full px-0 sm:px-2">
				<WalletStepper
					currentStep="pending"
					variant="pending"
					isArabic={isArabic}
				/>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-2 text-center">
				<Clock
					className="h-6 w-6 text-muted"
					strokeWidth={1.5}
					aria-hidden
				/>
				<span className="text-[15px] font-medium text-muted sm:text-[16px]">
					{isArabic
						? "الوقت المتبقي 24 - 48 ساعة عمل"
						: "Remaining time: 24–48 business hours"}
				</span>
			</div>

			<div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
				<button
					type="button"
					onClick={onViewContract}
					className="min-h-[48px] w-full rounded-xl bg-brand px-4 text-[16px] font-bold text-brand-foreground transition-opacity active:brightness-95 sm:min-h-[52px]"
				>
					{isArabic ? "استعراض العقد" : "View contract"}
				</button>
				<button
					type="button"
					onClick={onContactSupport}
					className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-card px-4 text-[16px] font-bold text-foreground transition-opacity active:brightness-95 sm:min-h-[52px]"
				>
					<Phone
						className="h-6 w-6 text-foreground"
						strokeWidth={1.5}
						aria-hidden
					/>
					<span>
						{isArabic
							? "تواصل مع خدمة العملاء"
							: "Contact customer support"}
					</span>
				</button>
			</div>
		</div>
	);
}
