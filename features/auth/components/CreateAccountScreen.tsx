"use client";

import { memo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
	AuthCheckbox,
	AuthErrorMessage,
	AuthShell,
	AuthTitle,
	BackHeader,
	PasswordField,
	PhoneField,
	PrimaryButton,
	TextField,
} from "@/features/auth/components/shared/AuthPrimitives";
import { isAccountExistsError } from "@/features/auth/lib/auth.lib";
import { useLanguage } from "@/features/language/useLanguage";

interface CreateAccountScreenProps {
	isLoading?: boolean;
	error?: string | null;
	onBack: () => void;
	onGoToLogin: (phone: string) => void;
	onForgotPassword: (phone: string) => void;
	onCreate: (data: {
		fullName: string;
		phone: string;
		email?: string;
		password: string;
		confirmPassword: string;
	}) => void;
}

const CreateAccountScreen = memo(function CreateAccountScreen({
	isLoading = false,
	error,
	onBack,
	onGoToLogin,
	onForgotPassword,
	onCreate,
}: CreateAccountScreenProps) {
	const { isArabic } = useLanguage();
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [agreed, setAgreed] = useState(false);

	const passwordsMismatch =
		confirmPassword.length > 0 && password !== confirmPassword;

	const isValid =
		fullName.trim().length > 1 &&
		phone.length === 9 &&
		password.length >= 8 &&
		password === confirmPassword &&
		agreed;

	const handleSubmit = useCallback(() => {
		if (!isValid) return;
		onCreate({
			fullName: fullName.trim(),
			phone: `+966${phone}`,
			...(email.trim() && { email: email.trim() }),
			password,
			confirmPassword,
		});
	}, [fullName, email, phone, password, confirmPassword, isValid, onCreate]);

	const fullPhone = `+966${phone}`;

	const handleGoToLogin = useCallback(() => {
		onGoToLogin(fullPhone);
	}, [fullPhone, onGoToLogin]);

	const handleForgotPassword = useCallback(() => {
		onForgotPassword(fullPhone);
	}, [fullPhone, onForgotPassword]);

	const handleTogglePassword = useCallback(() => {
		setShowPassword((s) => !s);
	}, []);

	const handleToggleConfirm = useCallback(() => {
		setShowConfirm((s) => !s);
	}, []);

	return (
		<AuthShell>
			<BackHeader onBack={onBack} disabled={isLoading} />

			<AuthTitle>{isArabic ? "إنشاء حساب" : "Create account"}</AuthTitle>

			<motion.div
				initial={{ y: 12, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.1, duration: 0.4 }}
				className="mt-6 flex flex-col gap-4"
			>
				<TextField
					label={isArabic ? "الاسم بالكامل" : "Full name"}
					value={fullName}
					onChange={(e) => setFullName(e.target.value)}
					placeholder={isArabic ? "ادخل اسمك بالكامل" : "Enter your full name"}
					disabled={isLoading}
				/>

				<TextField
					label={
						<>
							{isArabic ? "البريد الالكتروني" : "Email"}{" "}
							<span className="font-normal text-[#555555] dark:text-gray-400">
								{isArabic ? "(اختياري)" : "(optional)"}
							</span>
						</>
					}
					type="email"
					inputMode="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder={isArabic ? "اكتب البريد الالكتروني" : "Enter your email"}
					disabled={isLoading}
				/>

				<PhoneField value={phone} onChange={setPhone} disabled={isLoading} />

				<PasswordField
					label={isArabic ? "كلمة المرور" : "Password"}
					value={password}
					onChange={setPassword}
					show={showPassword}
					onToggle={handleTogglePassword}
					disabled={isLoading}
				/>

				<div>
					<PasswordField
						label={isArabic ? "ادخل كلمة المرور مرة اخرى" : "Re-enter password"}
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
								{isArabic
									? "كلمتا المرور غير متطابقتين"
									: "Passwords do not match"}
							</motion.p>
						)}
					</AnimatePresence>
				</div>

				<AuthCheckbox
					checked={agreed}
					onChange={setAgreed}
					disabled={isLoading}
					label={
						isArabic
							? "أوافق على الشروط وسياسة الخصوصية"
							: "I agree to the terms and privacy policy"
					}
				/>

				<AnimatePresence>
					{error && (
						<motion.div
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -4 }}
						>
							<AuthErrorMessage
								error={error}
								onLogin={isAccountExistsError(error) ? handleGoToLogin : undefined}
								onForgotPassword={
									isAccountExistsError(error) ? handleForgotPassword : undefined
								}
							/>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			<div className="mt-6 pt-2">
				<PrimaryButton onClick={handleSubmit} disabled={!isValid || isLoading}>
					{isLoading
						? isArabic
							? "جاري إنشاء الحساب..."
							: "Creating account..."
						: isArabic
							? "إنشاء حساب"
							: "Create account"}
				</PrimaryButton>
			</div>
		</AuthShell>
	);
});

export default CreateAccountScreen;
