"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers";

type Tab = "all" | "products" | "stores";

interface SearchTabsProps {
	activeTab: Tab;
	onTabChange: (tab: Tab) => void;
	counts: { all: number; products: number; stores: number };
	visible?: boolean;
}

export default function SearchTabs({
	activeTab,
	onTabChange,
	counts,
	visible = true,
}: SearchTabsProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";

	if (!visible) return null;

	const tabs: { id: Tab; labelEn: string; labelAr: string }[] = [
		{ id: "all", labelEn: "All", labelAr: "الكل" },
		{ id: "products", labelEn: "Products", labelAr: "المنتجات" },
		{ id: "stores", labelEn: "Stores", labelAr: "المتاجر" },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
			className="mb-6 flex justify-center"
		>
			<div className="inline-flex gap-1 rounded-2xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-900">
				{tabs.map((tab) => {
					const count = counts[tab.id];
					const active = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							onClick={() => onTabChange(tab.id)}
							aria-pressed={active}
							className={`relative rounded-xl px-5 py-2 text-sm font-semibold transition-colors duration-150 ${
								active
									? "text-white"
									: "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
							}`}
						>
							{active && (
								<motion.div
									layoutId="tab-pill"
									className="absolute inset-0 -z-10 rounded-xl bg-amber-500 shadow-md shadow-amber-200 dark:shadow-amber-900/30"
									transition={{ type: "spring", stiffness: 380, damping: 30 }}
								/>
							)}
							<span className="relative z-10">
								{isAr ? tab.labelAr : tab.labelEn}
								{count > 0 && (
									<span
										className={`ms-1.5 rounded-full px-1.5 py-0.5 text-xs font-bold ${
											active
												? "bg-white/25 text-white"
												: "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
										}`}
									>
										{count}
									</span>
								)}
							</span>
						</button>
					);
				})}
			</div>
		</motion.div>
	);
}
