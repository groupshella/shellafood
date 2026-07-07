"use client";

import {
	forwardRef,
	memo,
	type ButtonHTMLAttributes,
	type InputHTMLAttributes,
	type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { Tajawal } from "next/font/google";
import { isAccountExistsError } from "@/features/auth/lib/auth.lib";

export const tajawal = Tajawal({
	subsets: ["arabic", "latin"],
	weight: ["400", "500", "700"],
	variable: "--font-tajawal",
});

// ─── Design tokens ────────────────────────────────────────────────────────────
export const AUTH_COLORS = {
	primary: "#30913F",
	textPrimary: "#111B18",
	textSecondary: "#555555",
	placeholder: "#707784",
	border: "#C6C8CE",
	disabledBg: "#E2E4E6",
	secondaryBg: "#F6F6F6",
	secondaryText: "#43474F",
} as const;

// ─── Page shell (full viewport, responsive) ───────────────────────────────────
export const AuthShell = memo(function AuthShell({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			dir="rtl"
			lang="ar"
			className={`${tajawal.className} relative flex min-h-dvh w-full flex-col bg-white text-[#111B18] dark:bg-gray-900 dark:text-gray-100 ${className}`}
		>
			<div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 pb-8 pt-14 sm:pt-16">
				{children}
			</div>
		</div>
	);
});

// ─── Back header ──────────────────────────────────────────────────────────────
export const BackHeader = memo(function BackHeader({
	onBack,
	disabled,
}: {
	onBack: () => void;
	disabled?: boolean;
}) {
	return (
		<motion.button
			type="button"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			onClick={onBack}
			disabled={disabled}
			aria-label="رجوع"
			className="mb-4 -mr-2 flex h-10 w-10 items-center justify-center self-start rounded-full transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:opacity-50 dark:hover:bg-gray-700 dark:focus-visible:ring-gray-500"
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
			className="text-right text-[28px] font-bold leading-tight text-[#111B18] dark:text-gray-100 sm:text-[32px]"
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
			className="mt-2 text-right text-[16px] font-normal leading-relaxed text-[#555555] dark:text-gray-400"
		>
			{children}
		</motion.p>
	);
}

// ─── Field label ──────────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: ReactNode }) {
	return (
		<label className="mb-1.5 block text-right text-[14px] font-bold leading-[160%] text-[#111B18] dark:text-gray-100">
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
				className={`box-border h-14 w-full rounded-xl border border-[#C6C8CE] bg-white px-4 text-right text-[14px] text-[#111B18] outline-none transition-all placeholder:text-[#707784] focus:border-[#30913F] focus:ring-1 focus:ring-[#30913F] disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-[#30913F] ${className}`}
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
				fontFamily="'Tajawal', sans-serif"
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
	label = "رقم الهاتف",
}: {
	value: string;
	onChange: (v: string) => void;
	onEnter?: () => void;
	disabled?: boolean;
	label?: string;
}) {
	return (
		<div>
			<FieldLabel>{label}</FieldLabel>
			<div className="box-border flex h-14 w-full items-center gap-3 rounded-xl border border-[#C6C8CE] bg-white px-4 transition-all focus-within:border-[#30913F] focus-within:ring-1 focus-within:ring-[#30913F] dark:border-gray-600 dark:bg-gray-800 dark:focus-within:border-[#30913F]">
				<div className="flex shrink-0 items-center gap-2 border-l border-[#C6C8CE] pl-3 dark:border-gray-600">
					<SaudiFlag />
					<span
						dir="ltr"
						className="text-[14px] font-normal text-[#111B18] dark:text-gray-100"
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
					aria-label={label}
					className="min-w-0 flex-1 bg-transparent text-left text-[14px] text-[#343434] outline-none placeholder:text-[#707784] dark:text-gray-100 dark:placeholder:text-gray-500"
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
	placeholder = "كلمة المرور",
	show,
	onToggle,
	error,
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
}) {
	return (
		<div>
			<FieldLabel>{label}</FieldLabel>
			<div
				className={`box-border flex h-14 w-full items-center gap-3 rounded-xl border bg-white px-4 transition-all focus-within:ring-1 dark:bg-gray-800 ${error
					? "border-red-400 focus-within:border-red-400 focus-within:ring-red-400"
					: "border-[#C6C8CE] focus-within:border-[#30913F] focus-within:ring-[#30913F] dark:border-gray-600 dark:focus-within:border-[#30913F]"
					}`}
			>
				<button
					type="button"
					onClick={onToggle}
					className="shrink-0 text-[#555555] dark:text-gray-400"
					aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
				>
					{show ? <EyeIcon /> : <EyeSlashIcon />}
				</button>
				<input
					type={show ? "text" : "password"}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
					placeholder={placeholder}
					disabled={disabled}
					aria-label={typeof label === "string" ? label : "كلمة المرور"}
					className="min-w-0 flex-1 bg-transparent text-right text-[14px] text-[#111B18] outline-none placeholder:text-[#555555] dark:text-gray-100 dark:placeholder:text-gray-500"
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
			className={`box-border flex h-12 w-full items-center justify-center rounded-xl bg-[#30913F] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#2a8036] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30913F] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#E2E4E6] disabled:text-[#555555] disabled:hover:bg-[#E2E4E6] dark:focus-visible:ring-offset-gray-900 dark:disabled:bg-gray-700 dark:disabled:text-gray-500 ${className}`}
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
			className={`box-border flex h-12 w-full items-center justify-center rounded-xl bg-[#F6F6F6] px-4 text-[16px] font-bold text-[#43474F] transition-colors hover:bg-[#eeeeee] focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus-visible:ring-gray-500 ${className}`}
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
				className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${checked
					? "border-[#30913F] bg-[#30913F]"
					: "border-[#555555] bg-white dark:border-gray-500 dark:bg-gray-700"
					}`}
			>
				{checked && (
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
						<path
							d="M2.5 7.5 5.5 10.5 11.5 3.5"
							stroke="#fff"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</button>
			<span className="text-right text-[14px] font-normal text-[#111B18] dark:text-gray-200">{label}</span>
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
			<span className="text-right text-[14px] font-normal text-[#111B18] dark:text-gray-200">{children}</span>
		</div>
	);
});

// ─── Inline messages ──────────────────────────────────────────────────────────
export function ErrorMessage({ children }: { children: ReactNode }) {
	return (
		<p className="rounded-lg bg-red-50 px-3 py-2 text-right text-[14px] text-red-600 dark:bg-red-950/60 dark:text-red-400">
			{children}
		</p>
	);
}

export function AccountExistsErrorMessage({
	onLogin,
	onForgotPassword,
}: {
	onLogin: () => void;
	onForgotPassword: () => void;
}) {
	return (
		<div
			role="alert"
			className="rounded-lg bg-red-50 px-3 py-3 text-right text-[14px] leading-relaxed text-red-600 dark:bg-red-950/60 dark:text-red-400"
		>
			<p>
				يوجد حساب مرتبط بهذا الرقم بالفعل. يمكنك تسجيل الدخول أو استعادة كلمة
				المرور.
			</p>
			<div className="mt-3 flex flex-wrap items-center justify-end gap-3">
				<button
					type="button"
					onClick={onForgotPassword}
					className="text-[14px] font-medium text-[#555555] underline transition-colors hover:text-[#30913F] dark:text-gray-400 dark:hover:text-[#30913F]"
				>
					استعادة كلمة المرور
				</button>
				<button
					type="button"
					onClick={onLogin}
					className="rounded-lg bg-[#30913F] px-4 py-2 text-[14px] font-bold text-white transition-colors hover:bg-[#2a8036]"
				>
					تسجيل الدخول
				</button>
			</div>
		</div>
	);
}

export function AuthErrorMessage({
	error,
	onLogin,
	onForgotPassword,
}: {
	error: string;
	onLogin?: () => void;
	onForgotPassword?: () => void;
}) {
	if (onLogin && onForgotPassword && isAccountExistsError(error)) {
		return (
			<AccountExistsErrorMessage
				onLogin={onLogin}
				onForgotPassword={onForgotPassword}
			/>
		);
	}

	return <ErrorMessage>{error}</ErrorMessage>;
}

export function InfoMessage({ children }: { children: ReactNode }) {
	return (
		<p className="rounded-lg bg-green-50 px-3 py-2 text-right text-[14px] text-[#2a8036] dark:bg-green-950/60 dark:text-green-400">
			{children}
		</p>
	);
}
