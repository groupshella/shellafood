"use client";

import { useLanguage } from "@/providers/LanguageProvider";
import { EmptyState, SkeletonPage } from "..";
import { useProducts } from "../../hooks/useProudcts";
import ProductViewComponent from "./ProductView";
import { Product } from "../../types/product.types";

interface ProductPageProps {
productResponse: Product;
}

export default function ProductPage({
	productResponse,
}: ProductPageProps) {
return (
		<ProductViewComponent
			product={productResponse}
		/>
	);
}

