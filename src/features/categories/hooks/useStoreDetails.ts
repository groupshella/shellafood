"use client";

import { useEffect, useState, useCallback } from "react";
import { getStoreDetails } from "../api/stores.api";
import type { StoreDetails } from "../types/store.details.types";

export interface NotificationState {
	message: string;
	type: "success" | "error" | "info";
	isVisible: boolean;
}

export function useStoreDetails(
    storeId: string,
	language: string,
	
) {
	const [store, setStore] = useState<StoreDetails | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});
	const isArabic = language === 'ar';

	const fetchStoreDetails = useCallback(async () => {
		try {
			setLoading(true);

			//const result = await getStoreDetails(storeId, language);
			//console.log(result);
			
			//if (result.data) {
			//	setStore(result.data as StoreDetails);
			//} else {
			//	console.log(result.error);
			//	setNotification({
			//		message: result.error || (isArabic ? "فشل تحميل المتجر" : "Failed to load store"),
			//		type: "error",
			//		isVisible: true,
			//	});
			//}
		} catch (error) {
			console.log(error);
			setNotification({
				message: isArabic ? "خطأ في تحميل المتجر" : "Error loading store",
				type: "error",
				isVisible: true,
			});
		} finally {
			setLoading(false);
		}
	}, [language, isArabic, storeId]);

	useEffect(() => {
		fetchStoreDetails();
	}, [fetchStoreDetails]);

	return { store, notification, loading, setNotification };
}
