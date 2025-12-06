"use client";

import ProductViewComponent from "./ProductView";

interface ProductPageProps {
	categorySlug: string;
	storeSlug: string;
	departmentSlug: string;
	productSlug: string;
}

export default function ProductPage({
	categorySlug,
	storeSlug,
	departmentSlug,
	productSlug,
}: ProductPageProps) {
	return (
		<ProductViewComponent
			categorySlug={categorySlug}
			storeSlug={storeSlug}
			departmentSlug={departmentSlug}
			productSlug={productSlug}
		/>
	);
}

