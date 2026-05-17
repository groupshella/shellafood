"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/providers";
import { ProductCard } from "@/shared/components";
import { StoreCard } from "@/features/home/components/StoreSection/StoreCard";
import type { Product } from "@/shared/components";
import type { ApiStore } from "@/features/home/types/store.types";

interface SearchResultsProps {
	products: Product[];
	stores: ApiStore[];
	onProductClick: (productId: string) => void;
}

const container: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.05 } },
};
const item: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function SearchResults({
	products,
	stores,
	onProductClick,
}: SearchResultsProps) {
	const { language } = useLanguage();
	const isAr = language === "ar";

	return (
		<div className="space-y-10">
			{stores.length > 0 && (
				<section>
					<h2
						className={`text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 ${isAr ? "text-right" : ""}`}
					>
						{isAr ? `المتاجر (${stores.length})` : `Stores (${stores.length})`}
					</h2>
					<motion.div
						variants={container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
					>
						{stores.map((store) => (
							<motion.div key={store.id} variants={item}>
								<StoreCard store={store} />
							</motion.div>
						))}
					</motion.div>
				</section>
			)}

			{products.length > 0 && (
				<section>
					<h2
						className={`text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 ${isAr ? "text-right" : ""}`}
					>
						{isAr ? `المنتجات (${products.length})` : `Products (${products.length})`}
					</h2>
					<motion.div
						variants={container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
					>
						{products.map((product) => (
							<motion.div key={product.id} variants={item} whileHover={{ y: -4 }}>
								<ProductCard
									product={product}
									onClick={onProductClick}
									showAddButton
									showRating
									showStock
								/>
							</motion.div>
						))}
					</motion.div>
				</section>
			)}
		</div>
	);
}
