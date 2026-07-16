"use client";

import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
	AuthShell,
	AuthSubtitle,
	AuthTitle,
	BackHeader,
	ErrorMessage,
	HelperRow,
	PasswordField,
	PrimaryButton,
} from "@/features/auth/components/shared/AuthPrimitives";

interface NewPasswordScreenProps {
	isArabic: boolean;
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onSubmit: (password: string, confirmPassword: string) => void;
}

const NewPasswordScreen = memo(function NewPasswordScreen({
	isArabic,
	isLoading = false,
	error,
	onBack,
	onSubmit,
}: NewPasswordScreenProps) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;
	const isValid = password.length >= 8 && password === confirmPassword;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onSubmit(password, confirmPassword);
	}, [password, confirmPassword, isValid, onSubmit]);

	const handleTogglePassword = useCallback(() => {
		setShowPassword((s) => !s);
	}, []);

	const handleToggleConfirm = useCallback(() => {
		setShowConfirm((s) => !s);
	}, []);

	return (
		<AuthShell isArabic={isArabic}>
			<BackHeader onBack={onBack} disabled={isLoading} isArabic={isArabic} />

			<AuthTitle>
				{isArabic ? "إنشاء كلمة مرور جديدة" : "Create a new password"}
			</AuthTitle>
			<AuthSubtitle>
				{isArabic ? "ادخل كلمة المرور الجديدة" : "Enter your new password"}
			</AuthSubtitle>

			<motion.div
				initial={{ y: 12, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.4 }}
				className="mt-8 flex flex-col gap-4 md:mt-10"
			>
				<PasswordField
					label={isArabic ? "كلمة المرور" : "Password"}
					value={password}
					onChange={setPassword}
					show={showPassword}
					onToggle={handleTogglePassword}
					disabled={isLoading}
					isArabic={isArabic}
				/>

				<div>
					<PasswordField
						label={
							isArabic ? "اعادة كتابة كلمة المرور" : "Re-enter password"
						}
						value={confirmPassword}
						onChange={setConfirmPassword}
						onEnter={handleSubmit}
						show={showConfirm}
						onToggle={handleToggleConfirm}
						disabled={isLoading}
						error={passwordsMismatch}
						isArabic={isArabic}
					/>
					<AnimatePresence>
						{passwordsMismatch && (
							<motion.p
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -4 }}
								className="mt-1.5 text-start text-xs text-red-500 dark:text-red-400"
							>
								{isArabic
									? "كلمتا المرور غير متطابقتين"
									: "Passwords do not match"}
							</motion.p>
						)}
					</AnimatePresence>
				</div>

				<HelperRow>
					{isArabic
						? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"
						: "Password must be at least 8 characters"}
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

			<div className="mt-auto pt-8 md:pt-10">
				<PrimaryButton onClick={handleSubmit} disabled={!isValid || isLoading}>
					{isLoading
						? isArabic
							? "جاري الحفظ..."
							: "Saving..."
						: isArabic
							? "حفظ"
							: "Save"}
				</PrimaryButton>
			</div>
		</AuthShell>
	);
});

export default NewPasswordScreen;
