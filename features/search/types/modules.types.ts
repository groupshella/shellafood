export type SearchModuleType = "food" | "grocery" | "pharmacy" | "ecommerce" | string;

export interface SearchModule {
    id: number;
    module_name: string;
    module_type: SearchModuleType;
    status: string;
    icon_full_url: string;
}

export type GetSearchModulesResponse = SearchModule[];
