"use client";

import DepartmentView from "./DepartmentView";

interface DepartmentPageProps {
	categorySlug: string;
	storeSlug: string;
	departmentSlug: string;
}

export default function DepartmentPage({ categorySlug, storeSlug, departmentSlug }: DepartmentPageProps) {
	return <DepartmentView categorySlug={categorySlug} storeSlug={storeSlug} departmentSlug={departmentSlug} />;
}

