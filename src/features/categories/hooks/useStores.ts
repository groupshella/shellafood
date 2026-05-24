"use client";

import { useEffect, useState, useCallback } from "react";
import { StoreList } from "../types/store.types";
import { getAllStores } from "../api/stores.api";

export interface NotificationState {
	message: string;
	type: "success" | "error" | "info";
	isVisible: boolean;
}

export function useStores(
	moduleId: number,
	language: string,
	limit: number = 12,
	offset: number = 1,
) {
	const [storeList, setStoreList] = useState<StoreList>({
		total_size: 0,
		limit: limit,
		offset: offset,
		stores: [],
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});
	const isArabic = language === 'ar';

	const fetchStores = useCallback(async () => {
		try {
			setLoading(true);

			//const result = await getAllStores(limit, offset, language, moduleId);
			//console.log(result);

			//if (result.data) {
			//	setStoreList(result.data);
			//} else {
			//	console.log(result.error);
			//	setNotification({
			//		message: result.error || (isArabic ? "فشل تحميل المتاجر" : "Failed to load stores"),
			//		type: "error",
			//		isVisible: true,
			//	});
			//}
		} catch (error) {
			setNotification({
				message: isArabic ? "خطأ في تحميل المتاجر" : "Error loading stores",
				type: "error",
				isVisible: true,
			});
		} finally {
			setLoading(false);
		}
	}, [limit, offset, language, isArabic, moduleId]);

	useEffect(() => {
		fetchStores();
	}, [fetchStores]);

	return { storeList, notification, loading, setNotification };
}
