export interface ApiCategoryTranslation {
	locale: string;
	key: string;
	value: string;
}

/** Item from `GET /api/v1/categories` */
export interface ApiCategory {
	id: number;
	name: string;
	image?: string | null;
	image_full_url?: string | null;
	parent_id?: number;
	position?: number;
	status?: number;
	slug?: string;
	translations?: ApiCategoryTranslation[];
}

export interface CategoriesListResponse {
	categories: ApiCategory[];
}
