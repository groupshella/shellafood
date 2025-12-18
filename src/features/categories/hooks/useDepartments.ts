"use client";

import { useEffect, useState, useCallback } from "react";
import { getCachedDepartments, getDepartments, getStoreDetails } from "../api/stores.api";
import type { StoreDetails } from "../types/store.details.types";
import type { DepartmentResponse } from "../types/department.types";
import { DEFAULT_LANG } from "@/features/auth/constants/auth.constants";
export interface NotificationState {
	message: string;
	type: "success" | "error" | "info";
	isVisible: boolean;
}

export function useDepartments(
    moduleId: number,
	storeId: number,
    departmentId: number,
) {
	const [departmentResponse, setDepartmentResponse] = useState<DepartmentResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [notification, setNotification] = useState<NotificationState>({
		message: "",
		type: "success",
		isVisible: false,
	});

	    const fetchDepartments = useCallback(async () => {
		try {
			setLoading(true);

			//const result = await getCachedDepartments(limit, offset, moduleId, storeId, departmentId.toString(), DEFAULT_LANG);
			//setDepartmentResponse(result.data as DepartmentResponse);
		} catch (error) {
			console.log(error);
			setNotification({
					message: "خطأ في تحميل الأقسام",
				type: "error",
				isVisible: true,
			});
		} finally {
			setLoading(false);
		}
	}, [moduleId, storeId]);

	useEffect(() => {
		fetchDepartments();
	}, [fetchDepartments]);

	return { departmentResponse, notification, loading, setNotification };
}
