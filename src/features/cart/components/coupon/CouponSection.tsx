"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import type { Coupon } from "../../types/cart.types";
import { getAvailableCouponCodes } from "../../lib/services/coupon.service";
import AppliedCouponDisplay from "./AppliedCouponDisplay";
import CouponInputForm from "./CouponInputForm";

interface CouponSectionProps {
	language: "en" | "ar";
	appliedCoupon: Coupon | null;
	isApplying: boolean;
	error: string | null;
	onApply: (code: string) => Promise<void>;
	onRemove: () => void;
}

type ValidationState = "idle" | "valid" | "invalid";

export default function CouponSection({
	language,
	appliedCoupon,
	isApplying,
	error,
	onApply,
	onRemove,
}: CouponSectionProps) {
	const isArabic = language === "ar";
	const [couponCode, setCouponCode] = useState("");
	const [validationState, setValidationState] = useState<ValidationState>("idle");

	const availableCodes = getAvailableCouponCodes();
	const hintText = isArabic 
		? `جرب: ${availableCodes.join(", ")}`
		: `Try: ${availableCodes.join(", ")}`;

	// Sync validation state with applied coupon
	useEffect(() => {
		if (appliedCoupon) {
			setValidationState("valid");
			setCouponCode("");
			setTimeout(() => setValidationState("idle"), 2000);
		}
	}, [appliedCoupon]);

	// Sync validation state with error
	useEffect(() => {
		if (error) {
			setValidationState("invalid");
		}
	}, [error]);

	const handleApply = useCallback(async () => {
		if (!couponCode.trim()) {
			setValidationState("invalid");
			return;
		}

		setValidationState("idle");
		await onApply(couponCode);
	}, [couponCode, onApply]);

	const handleInputChange = useCallback((value: string) => {
		setCouponCode(value.toUpperCase());
		setValidationState("idle");
	}, []);

	const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !isApplying) {
			handleApply();
		}
	}, [isApplying, handleApply]);

	const getInputBorderClass = () => {
		if (validationState === "valid") {
			return "border-emerald-500 dark:border-emerald-500 focus:ring-emerald-500/20";
		}
		if (validationState === "invalid") {
			return "border-red-300 dark:border-red-700 focus:ring-red-500/20";
		}
		return "border-gray-300 dark:border-gray-600 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/20";
	};

	const getDiscountText = (coupon: Coupon) => {
		const discount = coupon.discountType === "percentage"
			? `${coupon.discountValue}%`
			: `${coupon.discountValue} ${isArabic ? "ريال" : "SAR"}`;
		return `${coupon.code} - ${discount} ${isArabic ? "خصم" : "off"}`;
	};

	// Get localized error message
	const getLocalizedError = () => {
		if (!error) return "";
		if (error === "Please enter a coupon code") {
			return isArabic ? "الرجاء إدخال رمز الكوبون" : error;
		}
		if (error === "Invalid or expired coupon") {
			return isArabic ? "كوبون غير صالح أو منتهي الصلاحية" : error;
		}
		if (error === "An error occurred. Please try again.") {
			return isArabic ? "حدث خطأ. الرجاء المحاولة مرة أخرى." : error;
		}
		return error;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5"
		>
			<div className="flex items-center gap-2 mb-4">
				<Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				<h3 className={`text-lg font-bold text-gray-900 dark:text-gray-100 ${isArabic ? "text-right" : "text-left"}`}>
					{isArabic ? "كوبون خصم" : "Coupon Code"}
				</h3>
			</div>

			{appliedCoupon ? (
				<AppliedCouponDisplay
					coupon={appliedCoupon}
					isArabic={isArabic}
					onRemove={onRemove}
					getDiscountText={getDiscountText}
				/>
			) : (
				<CouponInputForm
					couponCode={couponCode}
					isValidating={isApplying}
					validationState={validationState}
					error={getLocalizedError()}
					isArabic={isArabic}
					hintText={hintText}
					onInputChange={handleInputChange}
					onApply={handleApply}
					onKeyDown={handleKeyDown}
					getInputBorderClass={getInputBorderClass}
				/>
			)}
		</motion.div>
	);
}
