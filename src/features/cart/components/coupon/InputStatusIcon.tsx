"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2, Check, AlertCircle } from "lucide-react";

type ValidationState = "idle" | "valid" | "invalid";

interface InputStatusIconProps {
	isValidating: boolean;
	validationState: ValidationState;
	isArabic: boolean;
}

export default function InputStatusIcon({ 
	isValidating, 
	validationState, 
	isArabic 
}: InputStatusIconProps) {
	if (isValidating) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className={`absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
			>
				<Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
			</motion.div>
		);
	}

	if (validationState === "valid") {
		return (
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className={`absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
			>
				<Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
			</motion.div>
		);
	}

	if (validationState === "invalid") {
		return (
			<motion.div
				initial={{ scale: 0, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				className={`absolute ${isArabic ? "left-3" : "right-3"} top-1/2 -translate-y-1/2`}
			>
				<AlertCircle className="w-5 h-5 text-red-500" />
			</motion.div>
		);
	}

	return null;
}

