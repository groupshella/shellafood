"use client";

import DepartmentView from "./DepartmentView";
import { DepartmentResponse } from "../../types/department.types";

interface DepartmentPageProps {
	departmentResponse: DepartmentResponse;
	storeId: number;
	departmentId: number;
	initialPage: number;
	initialLimit: number;
}

export default function DepartmentPage({ departmentResponse, storeId, departmentId, initialPage, initialLimit }: DepartmentPageProps) {
return ( 
		<DepartmentView departmentResponse={departmentResponse} storeId={storeId} departmentId={departmentId} initialPage={initialPage} initialLimit={initialLimit} />
	);
}

