"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
	AuthShell,
	AuthTitle,
	BackHeader,
	ErrorMessage,
	HelperRow,
	PhoneField,
	PrimaryButton,
} from "@/features/auth/components/shared/AuthPrimitives";
import { useLanguage } from "@/features/language/useLanguage";

interface ForgotPasswordScreenProps {
	isLoading?: boolean;
	error?: string | null;
	prefillPhone?: string;
	onBack: () => void;
	onSubmit: (phone: string) => void;
}

const ForgotPasswordScreen = memo(function ForgotPasswordScreen({
	isLoading = false,
	error,
	prefillPhone = "",
	onBack,
	onSubmit,
}: ForgotPasswordScreenProps) {
	const { isArabic } = useLanguage();
	const [phone, setPhone] = useState(prefillPhone);

	useEffect(() => {
		if (prefillPhone) setPhone(prefillPhone);
	}, [prefillPhone]);

	const isValid = phone.length === 9;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onSubmit(`+966${phone}`);
	}, [phone, isValid, onSubmit]);

	return (
		<AuthShell>
			<BackHeader onBack={onBack} disabled={isLoading} />

			<AuthTitle>
				{isArabic ? "الاستعادة عن طريق" : "Recover via"}
			</AuthTitle>

			<motion.div
				initial={{ y: 12, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.4 }}
				className="mt-8 flex flex-col gap-4"
			>
				<PhoneField
					value={phone}
					onChange={setPhone}
					onEnter={handleSubmit}
					disabled={isLoading}
				/>

				<HelperRow>
					{isArabic
						? "سيتم ارسال رمز التحقق الى هاتفك"
						: "A verification code will be sent to your phone"}
				</HelperRow>

				<AnimatePresence>
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
						>
							<ErrorMessage>{error}</ErrorMessage>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			<div className="mt-auto pt-8">
				<PrimaryButton onClick={handleSubmit} disabled={!isValid || isLoading}>
					{isLoading
						? isArabic
							? "جاري الإرسال..."
							: "Sending..."
						: isArabic
							? "المتابعة"
							: "Continue"}
				</PrimaryButton>
			</div>
		</AuthShell>
	);
});

export default ForgotPasswordScreen;
