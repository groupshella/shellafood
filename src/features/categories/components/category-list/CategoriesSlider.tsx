"use client";

import { useState, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers";
import CategoriesSliderGrid from "./CategoriesSliderGrid";
import CategoriesSliderControls from "./CategoriesSliderControls";
import { Category } from "../../types/category.types";
import { ZoneDataModule } from "../../types/module.types";


function CategoriesSlider({
	modules,
}: { modules: ZoneDataModule[] }) {
	


	return (
		<CategoriesSliderControls
		>
			<CategoriesSliderGrid
				modules={modules}
			/>
		</CategoriesSliderControls>
	);
}

export default memo(CategoriesSlider);
