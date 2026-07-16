"use client";

import {
	forwardRef,
	memo,
	type ButtonHTMLAttributes,
	type InputHTMLAttributes,
	type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { isAccountExistsError } from "@/features/auth/lib/auth.lib";

// ─── Page shell (full viewport, responsive) ───────────────────────────────────
export const AuthShell = memo(function AuthShell({
	children,
	isArabic,
	className = "",
}: {
	children: ReactNode;
	isArabic: boolean;
	className?: string;
}) {
	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className={`relative flex min-h-dvh w-full flex-col bg-background text-foreground ${className}`}
		>
			<div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-8 pt-4 sm:pt-16 md:max-w-lg md:px-6 lg:max-w-xl lg:px-8">
				{children}
			</div>
		</div>
	);
});

// ─── Back header ──────────────────────────────────────────────────────────────
export const BackHeader = memo(function BackHeader({
	onBack,
	disabled,
	isArabic,
}: {
	onBack: () => void;
	disabled?: boolean;
	isArabic: boolean;
}) {
	return (
		<motion.button
			type="button"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			onClick={onBack}
			disabled={disabled}
			aria-label={isArabic ? "رجوع" : "Back"}
			className="mb-4 -me-2 flex h-10 w-10 items-center justify-center self-start rounded-full transition-colors hover:bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:opacity-50"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
				<path
					d="M9 6l6 6-6 6"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</motion.button>
	);
});

// ─── Titles ───────────────────────────────────────────────────────────────────
export function AuthTitle({ children }: { children: ReactNode }) {
	return (
		<motion.h1
			initial={{ y: 12, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.4 }}
			className="text-start text-[28px] font-bold leading-tight text-foreground sm:text-[32px] md:text-[34px]"
		>
			{children}
		</motion.h1>
	);
}

export function AuthSubtitle({ children }: { children: ReactNode }) {
	return (
		<motion.p
			initial={{ y: 8, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.1, duration: 0.4 }}
			className="mt-2 text-start text-[16px] font-normal leading-relaxed text-muted md:text-[17px]"
		>
			{children}
		</motion.p>
	);
}

// ─── Field label ──────────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: ReactNode }) {
	return (
		<label className="mb-1.5 block text-start text-[14px] font-bold leading-[160%] text-foreground">
			{children}
		</label>
	);
}

// ─── Text input (name, email, etc.) ───────────────────────────────────────────
export const TextField = forwardRef<
	HTMLInputElement,
	InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }
>(function TextField({ label, className = "", ...props }, ref) {
	return (
		<div>
			<FieldLabel>{label}</FieldLabel>
			<input
				ref={ref}
				className={`box-border h-14 w-full rounded-xl border border-[#C6C8CE] bg-background px-4 text-start text-[14px] text-foreground outline-none transition-all placeholder:text-muted focus:border-brand focus:ring-1 focus:ring-brand disabled:opacity-50 ${className}`}
				{...props}
			/>
		</div>
	);
});

// ─── Saudi flag ───────────────────────────────────────────────────────────────
export const SaudiFlag = memo(function SaudiFlag() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
			<rect width="24" height="24" rx="4" fill="#0C7A2F" />
			<text
				x="12"
				y="11"
				textAnchor="middle"
				fontSize="5"
				fill="#fff"
			>
				لا اله
			</text>
			<rect x="5" y="15" width="14" height="1.4" rx="0.7" fill="#fff" />
			<rect x="6" y="17" width="10" height="1" rx="0.5" fill="#fff" />
		</svg>
	);
});

// ─── Phone input (+966 prefix + Saudi flag) ───────────────────────────────────
export const PhoneField = memo(function PhoneField({
	value,
	onChange,
	onEnter,
	disabled,
	isArabic,
	label,
}: {
	value: string;
	onChange: (v: string) => void;
	onEnter?: () => void;
	disabled?: boolean;
	isArabic: boolean;
	label?: string;
}) {
	const resolvedLabel = label ?? (isArabic ? "رقم الهاتف" : "Phone number");

	return (
		<div>
			<FieldLabel>{resolvedLabel}</FieldLabel>
			<div className="box-border flex h-14 w-full items-center gap-3 rounded-xl border border-[#C6C8CE] bg-background px-4 transition-all focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
				<div className="flex shrink-0 items-center gap-2 border-e border-[#C6C8CE] pe-3">
					<SaudiFlag />
					<span
						dir="ltr"
						className="text-[14px] font-normal text-foreground"
					>
						+966
					</span>
				</div>
				<input
					type="tel"
					inputMode="numeric"
					dir="ltr"
					value={value}
					onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
					onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
					placeholder="12 234 5678"
					disabled={disabled}
					aria-label={resolvedLabel}
					className="min-w-0 flex-1 bg-transparent text-start text-[14px] text-foreground outline-none placeholder:text-muted"
				/>
			</div>
		</div>
	);
});

// ─── Password input (eye-slash toggle) ────────────────────────────────────────
const EyeIcon = memo(function EyeIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path
				d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	);
});

const EyeSlashIcon = memo(function EyeSlashIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
			<path
				d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
			<path d="M4 20 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
});

export const PasswordField = memo(function PasswordField({
	value,
	onChange,
	onEnter,
	disabled,
	label,
	placeholder,
	show,
	onToggle,
	error,
	isArabic,
}: {
	value: string;
	onChange: (v: string) => void;
	onEnter?: () => void;
	disabled?: boolean;
	label: ReactNode;
	placeholder?: string;
	show: boolean;
	onToggle: () => void;
	error?: boolean;
	isArabic: boolean;
}) {
	const resolvedPlaceholder =
		placeholder ?? (isArabic ? "كلمة المرور" : "Password");

	return (
		<div>
			<FieldLabel>{label}</FieldLabel>
			<div
				className={`box-border flex h-14 w-full items-center gap-3 rounded-xl border bg-background px-4 transition-all focus-within:ring-1 ${error
					? "border-red-400 focus-within:border-red-400 focus-within:ring-red-400"
					: "border-[#C6C8CE] focus-within:border-brand focus-within:ring-brand"
					}`}
			>
				<button
					type="button"
					onClick={onToggle}
					className="shrink-0 rounded text-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
					aria-label={
						show
							? isArabic
								? "إخفاء كلمة المرور"
								: "Hide password"
							: isArabic
								? "إظهار كلمة المرور"
								: "Show password"
					}
				>
					{show ? <EyeIcon /> : <EyeSlashIcon />}
				</button>
				<input
					type={show ? "text" : "password"}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
					placeholder={resolvedPlaceholder}
					disabled={disabled}
					aria-label={
						typeof label === "string"
							? label
							: isArabic
								? "كلمة المرور"
								: "Password"
					}
					className="min-w-0 flex-1 bg-transparent text-start text-[14px] text-foreground outline-none placeholder:text-muted"
				/>
			</div>
		</div>
	);
});

// ─── Buttons ──────────────────────────────────────────────────────────────────
interface AuthButtonProps {
	children: ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
	type?: "button" | "submit";
	"aria-label"?: string;
}

export const PrimaryButton = memo(function PrimaryButton({
	children,
	className = "",
	disabled,
	onClick,
	type = "button",
	...rest
}: AuthButtonProps) {
	return (
		<motion.button
			type={type}
			onClick={onClick}
			whileTap={{ scale: disabled ? 1 : 0.98 }}
			disabled={disabled}
			className={`box-border flex h-12 w-full items-center justify-center rounded-xl bg-brand px-4 text-[16px] font-bold text-brand-foreground transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:bg-[#E2E4E6] disabled:text-muted disabled:hover:bg-[#E2E4E6] disabled:hover:brightness-100 ${className}`}
			{...rest}
		>
			{children}
		</motion.button>
	);
});

export const SecondaryButton = memo(function SecondaryButton({
	children,
	className = "",
	disabled,
	onClick,
	type = "button",
	...rest
}: AuthButtonProps) {
	return (
		<motion.button
			type={type}
			onClick={onClick}
			whileTap={{ scale: disabled ? 1 : 0.98 }}
			disabled={disabled}
			className={`box-border flex h-12 w-full items-center justify-center rounded-xl bg-card px-4 text-[16px] font-bold text-muted transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
			{...rest}
		>
			{children}
		</motion.button>
	);
});

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export const AuthCheckbox = memo(function AuthCheckbox({
	checked,
	onChange,
	label,
	disabled,
}: {
	checked: boolean;
	onChange: (v: boolean) => void;
	label: ReactNode;
	disabled?: boolean;
}) {
	return (
		<label className="flex cursor-pointer select-none items-center gap-2 opacity-80">
			<button
				type="button"
				role="checkbox"
				aria-checked={checked}
				disabled={disabled}
				onClick={() => onChange(!checked)}
				className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${checked
					? "border-brand bg-brand"
					: "border-muted bg-background"
					}`}
			>
				{checked && (
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
						<path
							d="M2.5 7.5 5.5 10.5 11.5 3.5"
							stroke="var(--brand-foreground)"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</button>
			<span className="text-start text-[14px] font-normal text-foreground">{label}</span>
		</label>
	);
});

// ─── Helper row (lock icon + text) ────────────────────────────────────────────
export const HelperRow = memo(function HelperRow({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-center justify-start gap-2 opacity-80">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
				<rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
				<path
					d="M8 10V7a4 4 0 0 1 8 0v3"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
				/>
			</svg>
			<span className="text-start text-[14px] font-normal text-foreground">{children}</span>
		</div>
	);
});

// ─── Inline messages ──────────────────────────────────────────────────────────
export function ErrorMessage({ children }: { children: ReactNode }) {
	return (
		<p className="rounded-lg bg-red-50 px-3 py-2 text-start text-[14px] text-red-600 dark:bg-red-950/60 dark:text-red-400">
			{children}
		</p>
	);
}

export function AccountExistsErrorMessage({
	onLogin,
	onForgotPassword,
	isArabic,
}: {
	onLogin: () => void;
	onForgotPassword: () => void;
	isArabic: boolean;
}) {
	return (
		<div
			role="alert"
			className="rounded-lg bg-red-50 px-3 py-3 text-start text-[14px] leading-relaxed text-red-600 dark:bg-red-950/60 dark:text-red-400"
		>
			<p>
				{isArabic
					? "يوجد حساب مرتبط بهذا الرقم بالفعل. يمكنك تسجيل الدخول أو استعادة كلمة المرور."
					: "An account is already linked to this number. You can sign in or reset your password."}
			</p>
			<div className="mt-3 flex flex-wrap items-center justify-end gap-3">
				<button
					type="button"
					onClick={onForgotPassword}
					className="rounded text-[14px] font-medium text-muted underline transition-colors hover:text-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
				>
					{isArabic ? "استعادة كلمة المرور" : "Reset password"}
				</button>
				<button
					type="button"
					onClick={onLogin}
					className="rounded-lg bg-brand px-4 py-2 text-[14px] font-bold text-brand-foreground transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
				>
					{isArabic ? "تسجيل الدخول" : "Sign in"}
				</button>
			</div>
		</div>
	);
}

export function AuthErrorMessage({
	error,
	onLogin,
	onForgotPassword,
	isArabic,
}: {
	error: string;
	onLogin?: () => void;
	onForgotPassword?: () => void;
	isArabic: boolean;
}) {
	if (onLogin && onForgotPassword && isAccountExistsError(error)) {
		return (
			<AccountExistsErrorMessage
				onLogin={onLogin}
				onForgotPassword={onForgotPassword}
				isArabic={isArabic}
			/>
		);
	}

	return <ErrorMessage>{error}</ErrorMessage>;
}

export function InfoMessage({ children }: { children: ReactNode }) {
	return (
		<p className="rounded-lg bg-green-50 px-3 py-2 text-start text-[14px] text-brand dark:bg-green-950/60 dark:text-green-400">
			{children}
		</p>
	);
}
