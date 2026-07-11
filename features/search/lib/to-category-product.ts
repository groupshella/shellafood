import type { CategoryProduct } from "@/features/hyper-market/Categories/types/category-detail.types";
import type { SearchProduct } from "@/features/search/types/search.types";

export function toCategoryProduct(product: SearchProduct): CategoryProduct {
	const hasDiscount = product.discounted_price > 0 && product.discounted_price < product.price;
	const discountPercentage =
		product.discount > 0
			? product.discount
			: hasDiscount
				? Math.round((1 - product.discounted_price / product.price) * 100)
				: null;

	return {
		id: product.id,
		name: product.name,
		full_image_url: product.image_full_url,
		price: product.price,
		discounted_price: hasDiscount ? product.discounted_price : null,
		discount_percentage: discountPercentage,
	};
}
