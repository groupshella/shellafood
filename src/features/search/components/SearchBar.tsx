"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/providers";
import { useDebounce } from "@/shared/hooks";
import { getSearchSuggestions } from "@/lib/utils/searchUtils";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (value: string) => void;
	isLoading?: boolean;
	autoFocus?: boolean;
}

export default function SearchBar({
	value,
	onChange,
	onSubmit,
	isLoading = false,
	autoFocus = false,
}: SearchBarProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";
	const inputRef = useRef<HTMLInputElement>(null);
	const [showSug, setShowSug] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const debounced = useDebounce(value, 250);

	// Auto-focus
	useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);

	// Global shortcuts: "/" = focus, "Esc" = clear
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "/" && document.activeElement !== inputRef.current) {
				e.preventDefault();
				inputRef.current?.focus();
			}
			if (e.key === "Escape" && value) {
				onChange("");
				setShowSug(false);
				inputRef.current?.blur();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [value, onChange]);

	// Suggestions from local history
	useEffect(() => {
		setSuggestions(debounced.trim() && showSug ? getSearchSuggestions(debounced, 5) : []);
	}, [debounced, showSug]);

	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			const t = value.trim();
			if (!t) return;
			onSubmit(t);
			setShowSug(false);
			inputRef.current?.blur();
		},
		[value, onSubmit],
	);

	const handleClear = useCallback(() => {
		onChange("");
		setShowSug(false);
		inputRef.current?.focus();
	}, [onChange]);

	const pickSuggestion = useCallback(
		(s: string) => { onChange(s); onSubmit(s); setShowSug(false); },
		[onChange, onSubmit],
	);

	const placeholder = isAr
		? "ابحث عن مطعم أو متجر..."
		: "Search for a restaurant or store...";

	return (
		<div className="relative mb-10 max-w-3xl mx-auto">
			<form onSubmit={handleSubmit}>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
					className="relative group"
				>
					{/* Leading icon */}
					<div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "right-4" : "left-4"} z-10 pointer-events-none`}>
						{isLoading
							? <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
							: <Search className="w-5 h-5 text-gray-400 group-focus-within:text-amber-500 transition-colors duration-200" />
						}
					</div>

					<input
						ref={inputRef}
						type="text"
						role="searchbox"
						aria-label={isAr ? "بحث عن متجر" : "Search stores"}
						placeholder={placeholder}
						value={value}
						dir={isAr ? "rtl" : "ltr"}
						autoComplete="off"
						onChange={(e) => { onChange(e.target.value); setShowSug(true); }}
						onFocus={() => setShowSug(true)}
						onBlur={() => setTimeout(() => setShowSug(false), 160)}
						className={`
              w-full ${isAr ? "pr-12 pl-28" : "pl-12 pr-28"}
              py-4 sm:py-5 text-base sm:text-lg
              bg-white dark:bg-gray-900
              border-2 border-gray-200 dark:border-gray-700
              rounded-2xl shadow-sm
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-600
              focus:outline-none focus:border-amber-400 dark:focus:border-amber-500
              focus:shadow-[0_0_0_4px_rgba(251,191,36,0.12)]
              transition-all duration-200
            `}
					/>

					{/* Clear button */}
					<AnimatePresence>
						{value && (
							<motion.button
								key="clear"
								type="button"
								initial={{ opacity: 0, scale: 0.6 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.6 }}
								transition={{ duration: 0.13 }}
								onClick={handleClear}
								className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "left-20" : "right-20"} z-10 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
								aria-label={isAr ? "مسح" : "Clear"}
							>
								<X className="w-4 h-4 text-gray-400" />
							</motion.button>
						)}
					</AnimatePresence>

					{/* Submit button */}
					<motion.button
						type="submit"
						disabled={!value.trim() || isLoading}
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						className={`
              absolute top-1/2 -translate-y-1/2 ${isAr ? "left-2" : "right-2"} z-10
              px-5 py-2.5 rounded-xl
              bg-amber-500 hover:bg-amber-600
              text-white font-bold text-sm
              shadow-md shadow-amber-200/60 dark:shadow-amber-900/30
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
              transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
            `}
					>
						{isAr ? "بحث" : "Search"}
					</motion.button>
				</motion.div>

				{/* Suggestions dropdown */}
				<AnimatePresence>
					{showSug && suggestions.length > 0 && (
						<motion.ul
							key="sug"
							role="listbox"
							initial={{ opacity: 0, y: -6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ duration: 0.15 }}
							className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden py-1"
						>
							{suggestions.map((s, i) => (
								<li key={i} role="option">
									<button
										type="button"
										onMouseDown={() => pickSuggestion(s)}
										className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors text-sm ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
									>
										<Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
										<span className="text-gray-800 dark:text-gray-200">{s}</span>
									</button>
								</li>
							))}
						</motion.ul>
					)}
				</AnimatePresence>
			</form>

			{/* Keyboard hint */}
			{!value && (
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1 }}
					className={`absolute -bottom-6 ${isAr ? "right-1" : "left-1"} text-xs text-gray-400 dark:text-gray-600`}
				>
					{isAr ? 'اضغط "/" للبحث · Esc لمسح' : 'Press "/" to focus · Esc to clear'}
				</motion.p>
			)}
		</div>
	);
}