"use client";

import { memo } from "react";
import { Category } from "../../types/category.types";
import CategoriesPageComponent from "./index";

function CategoriesPage({ categories }: { categories: Category[] }) {
	return <CategoriesPageComponent categories={categories} />;
}

export default memo(CategoriesPage);
