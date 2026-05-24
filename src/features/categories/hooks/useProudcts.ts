"use client";

import { useEffect, useState, useCallback } from "react";
import { getProductDetails } from "../api/products.api";
import type { Product } from "../types/product.types";
export interface NotificationState {
	message: string;
	type: "success" | "error" | "info";
	isVisible: boolean;
}

export function useProducts(
	moduleId: number,
	storeId: number,
	departmentId: number,
	productId: number,
	language: string,
) {
	const [productResponse, setProductResponse] = useState<Product | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});
	const isArabic = language === 'ar';

	const fetchProducts = useCallback(async () => {
		try {
			setLoading(true);

			//const result = await getProductDetails(moduleId, storeId, departmentId, productId, language);
			//console.log(result);

			//if (result.data) {
			//	setProductResponse(result.data as Product);
			//} else {
			//	console.log(result.error);
			//	setNotification({
			//		message: result.error || (isArabic ? "فشل تحميل المنتج" : "Failed to load product"),
			//		type: "error",
			//		isVisible: true,
			//	});
			//}
		} catch (error) {
			setNotification({
				message: isArabic ? "خطأ في تحميل المنتج" : "Error loading product",
				type: "error",
				isVisible: true,
			});
		} finally {
			setLoading(false);
		}
	}, [language, isArabic, moduleId, storeId, departmentId, productId]);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	return { productResponse, notification, loading, setNotification };
}
