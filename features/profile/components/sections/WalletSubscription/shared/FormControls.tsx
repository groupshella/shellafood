"use client";

import { Calendar, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
	FormField,
	inputClassName,
} from "@/features/profile/components/shared/registration/FormField";

export type SelectOption = { value: string; label: string };

export function FieldError({ message, id }: { message?: string; id?: string }) {
	if (!message) return null;
	return (
		<p
			id={id}
			role="alert"
			aria-live="polite"
			className="mt-1 text-start text-[12px] font-medium text-red-500"
		>
			{message}
		</p>
	);
}

function errorInputClass(hasError: boolean) {
	return hasError
		? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
		: "";
}

interface TextInputProps {
	label: string;
	required?: boolean;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: string;
	inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
	autoComplete?: string;
	dir?: "rtl" | "ltr";
	error?: string;
	fieldId: string;
	name: string;
}

export function TextInput({
	label,
	required,
	value,
	onChange,
	placeholder,
	type = "text",
	inputMode,
	autoComplete,
	dir = "rtl",
	error,
	fieldId,
	name,
}: TextInputProps) {
	const errorId = `${fieldId}-error`;
	return (
		<FormField label={label} required={required}>
			<input
				id={fieldId}
				name={name}
				type={type}
				inputMode={inputMode}
				autoComplete={autoComplete}
				placeholder={placeholder}
				value={value}
				dir={dir}
				onChange={(e) => onChange(e.target.value)}
				aria-required={required}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				data-error={error ? "true" : undefined}
				className={`${inputClassName} text-start ${errorInputClass(!!error)}`}
			/>
			<FieldError message={error} id={errorId} />
		</FormField>
	);
}

interface DateInputProps {
	label: string;
	required?: boolean;
	value: string;
	onChange: (value: string) => void;
	error?: string;
	fieldId: string;
	name: string;
}

export function DateInput({
	label,
	required,
	value,
	onChange,
	error,
	fieldId,
	name,
}: DateInputProps) {
	const errorId = `${fieldId}-error`;
	return (
		<FormField label={label} required={required}>
			<div
				className={`${inputClassName} justify-between gap-2 ${errorInputClass(!!error)}`}
				data-error={error ? "true" : undefined}
			>
				<Calendar
					className="h-5 w-5 shrink-0 text-muted"
					strokeWidth={1.5}
					aria-hidden
				/>
				<input
					id={fieldId}
					name={name}
					type="text"
					inputMode="numeric"
					placeholder="yyyy-mm-dd"
					value={value}
					dir="ltr"
					onChange={(e) => onChange(e.target.value)}
					aria-required={required}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					className="min-w-0 flex-1 bg-transparent text-start outline-none placeholder:text-muted"
				/>
			</div>
			<FieldError message={error} id={errorId} />
		</FormField>
	);
}

interface SelectFieldProps {
	label: string;
	required?: boolean;
	value: string;
	options: readonly SelectOption[];
	placeholder: string;
	onChange: (value: string) => void;
	error?: string;
	fieldId: string;
	extra?: React.ReactNode;
}

export function SelectField({
	label,
	required,
	value,
	options,
	placeholder,
	onChange,
	error,
	fieldId,
	extra,
}: SelectFieldProps) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const errorId = `${fieldId}-error`;
	const selected = options.find((o) => o.value === value);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: MouseEvent) => {
			if (!ref.current?.contains(event.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		return () => document.removeEventListener("mousedown", onPointerDown);
	}, [open]);

	return (
		<FormField label={label} required={required}>
			<div
				ref={ref}
				className="relative"
				id={fieldId}
				data-error={error ? "true" : undefined}
			>
				<button
					type="button"
					onClick={() => setOpen((p) => !p)}
					aria-haspopup="listbox"
					aria-expanded={open}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					className={`${inputClassName} justify-between text-start ${errorInputClass(!!error)}`}
				>
					<div className="flex min-w-0 items-center gap-1.5">
						{extra}
						<span
							className={
								selected
									? "truncate font-medium text-foreground"
									: "truncate text-muted"
							}
						>
							{selected?.label ?? placeholder}
						</span>
					</div>
					<ChevronDown
						className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
						strokeWidth={1.5}
					/>
				</button>
				{open && (
					<ul
						role="listbox"
						className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-y-auto rounded-2xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
					>
						{options.map((option, index) => (
							<li
								key={option.value}
								role="option"
								aria-selected={value === option.value}
							>
								<button
									type="button"
									onClick={() => {
										onChange(option.value);
										setOpen(false);
									}}
									className={`w-full px-4 py-3.5 text-start text-[14px] transition-colors active:bg-background ${
										value === option.value
											? "font-semibold text-brand"
											: "text-foreground"
									} ${index > 0 ? "border-t border-border" : ""}`}
								>
									{option.label}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
			<FieldError message={error} id={errorId} />
		</FormField>
	);
}

interface RadioFieldProps {
	label: string;
	required?: boolean;
	options: readonly SelectOption[];
	value: string;
	onChange: (value: string) => void;
	error?: string;
	fieldId: string;
}

export function RadioField({
	label,
	required,
	options,
	value,
	onChange,
	error,
	fieldId,
}: RadioFieldProps) {
	const errorId = `${fieldId}-error`;
	return (
		<FormField label={label} required={required}>
			<div
				id={fieldId}
				role="radiogroup"
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				data-error={error ? "true" : undefined}
				className={[
					"overflow-hidden rounded-xl border bg-card",
					error ? "border-red-500" : "border-transparent",
				].join(" ")}
			>
				{options.map((opt, i) => {
					const selected = value === opt.value;
					return (
						<button
							key={opt.value}
							type="button"
							role="radio"
							aria-checked={selected}
							onClick={() => onChange(opt.value)}
							className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-[15px] ${
								i > 0 ? "border-t border-border bg-background" : ""
							}`}
						>
							<span
								className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
									selected ? "border-brand" : "border-border"
								}`}
							>
								{selected && (
									<span className="h-2.5 w-2.5 rounded-full bg-brand" />
								)}
							</span>
							<span className="min-w-0 flex-1 text-start font-medium text-foreground">
								{opt.label}
							</span>
						</button>
					);
				})}
			</div>
			<FieldError message={error} id={errorId} />
		</FormField>
	);
}
