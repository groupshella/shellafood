"use client";

import React, { useState, useRef } from "react";

interface UploadFileInputProps {
	label: string;
	name: string; // Field name for form data
	selectedFile:File|null;
	onChange: (name: string, file: File | null) => void; // Returns field name and File
	isArabic?: boolean;
	className?: string;
	containerClassName?: string;
	disabled?: boolean;
	required?: boolean;
	accept?: string; // e.g., "image/*", ".pdf", "image/jpeg,image/png"
	maxSizeMB?: number; // Max file size in MB
}

/**
 * Simple File Upload Component
 * Returns the File object directly to parent component
 */
export const UploadFileInput: React.FC<UploadFileInputProps> = ({
	label,
	name,
	selectedFile,
	onChange,
	isArabic = true,
	className = "",
	containerClassName = "",
	disabled = false,
	required = false,
	accept = "image/*",
	maxSizeMB = 4,
}) => {
	const [preview, setPreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setError(null);

		if (!file) {
			
			setPreview(null);
			onChange(name, null);
			return;
		}

		// Validate file size
		const fileSizeMB = file.size / (1024 * 1024);
		if (fileSizeMB > maxSizeMB) {
			const errorMsg = isArabic 
				? `حجم الملف كبير جداً. الحد الأقصى ${maxSizeMB}MB`
				: `File size too large. Maximum ${maxSizeMB}MB`;
			setError(errorMsg);
			
			setPreview(null);
			onChange(name, null);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
			return;
		}

		// Set file and create preview for images
		
		onChange(name, file);

		// Create preview if it's an image
		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreview(null);
		}
	};

	const handleRemove = () => {
		
		setPreview(null);
		setError(null);
		onChange(name, null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleClick = () => {
		if (!disabled) {
			fileInputRef.current?.click();
		}
	};

	return (
		<div className={`space-y-2 ${className}`}>
			{/* Label */}
			<label className={`block font-semibold text-gray-700 dark:text-gray-300 ${isArabic ? "text-right" : "text-left"}`}>
				{label}
				{required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
			</label>

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				name={name}
				accept={accept}
				onChange={handleFileChange}
				disabled={disabled}
				className="hidden"
			/>

			{/* Upload Container */}
			<div
				onClick={handleClick}
				className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
					selectedFile && !error
						? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
						: error
						? "border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20"
						: "border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
				} ${containerClassName} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
			>
				{selectedFile && !error ? (
					/* Success State - Show Uploaded File */
					<div className="flex flex-col items-center gap-4 p-6">
						<div className="flex items-center gap-2 text-green-600 dark:text-green-400">
							<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
							<span className="text-sm font-semibold">
								{isArabic ? "تم اختيار الملف" : "File selected"}
							</span>
						</div>
						
						{/* Image Preview or File Info */}
						{preview ? (
							<div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
								<img
									src={preview}
									alt={label}
									className="w-full h-auto object-cover max-h-48"
								/>
							</div>
						) : (
							<div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
								<svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
								</svg>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
										{selectedFile.name}
									</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{(selectedFile.size / 1024).toFixed(2)} KB
									</p>
								</div>
							</div>
						)}

						{/* Remove Button */}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								handleRemove();
							}}
							disabled={disabled}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
							{isArabic ? "إزالة الملف" : "Remove file"}
						</button>
					</div>
				) : (
					/* Initial Upload State */
					<div className="flex flex-col items-center justify-center p-8">
						{/* Upload Icon */}
						<div className="mb-4">
							<svg
								className="w-16 h-16 text-gray-400 dark:text-gray-500"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
								/>
							</svg>
						</div>

						{/* Upload Text */}
						<div className="text-center space-y-2">
							<p className="text-base font-medium text-gray-700 dark:text-gray-300">
								{isArabic ? "انقر لاختيار ملف" : "Click to select file"}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{isArabic ? "أو اسحب وأفلت الملف هنا" : "or drag and drop file here"}
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-500">
								{isArabic 
									? `PNG, JPG, GIF حتى ${maxSizeMB}MB` 
									: `PNG, JPG, GIF up to ${maxSizeMB}MB`}
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
					<svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<p className="text-sm text-red-700 dark:text-red-300">{error}</p>
				</div>
			)}
		</div>
	);
};
