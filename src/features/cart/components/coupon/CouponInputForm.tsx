"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Loader2, Sparkles, AlertCircle } from "lucide-react";
import InputStatusIcon from "./InputStatusIcon";

type ValidationState = "idle" | "valid" | "invalid";

interface CouponInputFormProps {
	couponCode: string;
	isValidating: boolean;
	validationState: ValidationState;
	error: string;
	isArabic: boolean;
	hintText: string;
	onInputChange: (value: string) => void;
	onApply: () => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	getInputBorderClass: () => string;
}

export default function CouponInputForm({
	couponCode,
	isValidating,
	validationState,
	error,
	isArabic,
	hintText,
	onInputChange,
	onApply,
	onKeyDown,
	getInputBorderClass,
}: CouponInputFormProps) {
	return (
		<div className="space-y-3">
			<div className="flex gap-2">
				<div className="flex-1 relative">
					<Tag className={`absolute ${isArabic ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 z-10`} />
					<motion.input
						type="text"
						value={couponCode}
						onChange={(e) => onInputChange(e.target.value)}
						onKeyDown={onKeyDown}
						placeholder={isArabic ? "أدخل رمز الكوبون" : "Enter coupon code"}
						className={`w-full px-4 ${isArabic ? "pr-10" : "pl-10"} py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${getInputBorderClass()} ${isArabic ? "text-right" : "text-left"}`}
						dir={isArabic ? "rtl" : "ltr"}
						disabled={isValidating}
					/>
					<InputStatusIcon
						isValidating={isValidating}
						validationState={validationState}
						isArabic={isArabic}
					/>
				</div>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={onApply}
					disabled={isValidating || !couponCode.trim()}
					className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center"
				>
					{isValidating ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<Tag className="w-4 h-4" />
					)}
					<span>{isArabic ? "تطبيق" : "Apply"}</span>
				</motion.button>
			</div>

			<AnimatePresence>
				{error && (
					<motion.p
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={`text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-2 ${isArabic ? "text-right flex-row-reverse" : "text-left"}`}
					>
						<AlertCircle className="w-4 h-4 flex-shrink-0" />
						{error}
					</motion.p>
				)}
			</AnimatePresence>

			<p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
				<Sparkles className="w-3 h-3" />
				<span>{hintText}</span>
			</p>
		</div>
	);
}

