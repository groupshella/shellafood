"use client";

import { Check, FileImage, ImagePlus, Trash2 } from "lucide-react";
import { useRef } from "react";
import { formatFileSize } from "@/features/profile/lib/upload.lib";

interface UploadedFile {
	file: File;
	previewName: string;
}

interface FileUploadZoneProps {
	title: string;
	helperText?: string;
	uploaded: UploadedFile | null;
	onSelect: (file: File) => void;
	onRemove: () => void;
	accept?: string;
	variant?: "image" | "document";
	isArabic?: boolean;
}

export function FileUploadZone({
	title,
	helperText,
	uploaded,
	onSelect,
	onRemove,
	accept = "image/*",
	variant = "image",
	isArabic = true,
}: FileUploadZoneProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const resolvedHelper =
		helperText ??
		(isArabic
			? "برجاء التأكد أن الصورة واضحة وبحد أقصى 2 ميجا."
			: "Please make sure the image is clear and under 2MB.");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) onSelect(file);
		event.target.value = "";
	};

	if (uploaded) {
		return (
			<div className="flex min-h-[72px] items-center gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-3 py-3 sm:px-4 sm:py-4">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/60">
					<FileImage className="h-5 w-5 text-brand" />
				</div>
				<div className="min-w-0 flex-1 text-start">
					<p className="truncate text-[14px] font-semibold text-foreground">
						{uploaded.previewName || uploaded.file.name}
					</p>
					<p className="mt-0.5 text-[12px] text-muted">
						{isArabic
							? `حجم الصورة ${formatFileSize(uploaded.file.size)}`
							: `File size ${formatFileSize(uploaded.file.size)}`}
					</p>
				</div>

				<button
					type="button"
					onClick={onRemove}
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-red-500 transition-colors active:bg-red-500/10"
					aria-label={isArabic ? "حذف الملف" : "Remove file"}
				>
					<Trash2 className="h-5 w-5" />
				</button>
			</div>
		);
	}

	const Icon = variant === "document" ? FileImage : ImagePlus;

	return (
		<>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				className="flex min-h-[156px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card px-4 py-7 transition-colors active:border-brand/40 active:bg-background/50 sm:min-h-[168px] sm:py-8"
			>
				<Icon className="h-7 w-7 text-muted" strokeWidth={1.5} />
				<p className="text-[14px] font-semibold text-foreground">{title}</p>
				<p className="max-w-[260px] text-center text-[12px] leading-relaxed text-muted sm:max-w-xs">
					{resolvedHelper}
				</p>
			</button>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="hidden"
				onChange={handleChange}
			/>
		</>
	);
}

interface TermsCheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	isArabic?: boolean;
}

export function TermsCheckbox({
	checked,
	onChange,
	label,
	isArabic = true,
}: TermsCheckboxProps) {
	const resolvedLabel =
		label ??
		(isArabic
			? "أوافق على الشروط وسياسة الخصوصية"
			: "I agree to the terms and privacy policy");

	return (
		<label className="flex cursor-pointer items-center gap-3 py-1">
			<button
				type="button"
				role="checkbox"
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
					checked
						? "border-brand bg-brand text-brand-foreground"
						: "border-border bg-card"
				}`}
			>
				{checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
			</button>
			<span className="min-w-0 flex-1 text-start text-[14px] leading-relaxed text-foreground sm:text-[15px]">
				{resolvedLabel}
			</span>
		</label>
	);
}
