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
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onSubmit: (password: string, confirmPassword: string) => void;
}

const NewPasswordScreen = memo(function NewPasswordScreen({
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
		<AuthShell>
			<BackHeader onBack={onBack} disabled={isLoading} />

			<AuthTitle>إنشاء كلمة مرور جديدة</AuthTitle>
			<AuthSubtitle>ادخل كلمة المرور الجديدة</AuthSubtitle>

			<motion.div
				initial={{ y: 12, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.15, duration: 0.4 }}
				className="mt-8 flex flex-col gap-4"
			>
				<PasswordField
					label="كلمة المرور"
					value={password}
					onChange={setPassword}
					show={showPassword}
					onToggle={handleTogglePassword}
					disabled={isLoading}
				/>

				<div>
					<PasswordField
						label="اعادة كتابة كلمة المرور"
						value={confirmPassword}
						onChange={setConfirmPassword}
						onEnter={handleSubmit}
						show={showConfirm}
						onToggle={handleToggleConfirm}
						disabled={isLoading}
						error={passwordsMismatch}
					/>
					<AnimatePresence>
						{passwordsMismatch && (
							<motion.p
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -4 }}
								className="mt-1.5 text-start text-xs text-red-500 dark:text-red-400"
							>
								كلمتا المرور غير متطابقتين
							</motion.p>
						)}
					</AnimatePresence>
				</div>

				<HelperRow>يجب أن تتكون كلمة المرور من 8 أحرف على الأقل</HelperRow>

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
					{isLoading ? "جاري الحفظ..." : "حفظ"}
				</PrimaryButton>
			</div>
		</AuthShell>
	);
});

export default NewPasswordScreen;
