"use client";

import { memo } from "react";
import { Category } from "../../types/category.types";
import CategoriesPageComponent from "./index";
import { ZoneDataModule } from "../../types/module.types";

function CategoriesPage({ initialModules }: { initialModules: ZoneDataModule[] }) {
	return <CategoriesPageComponent initialModules={initialModules} />;
}

export default memo(CategoriesPage);
