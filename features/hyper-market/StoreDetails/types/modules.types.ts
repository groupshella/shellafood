export type StoreModuleType = "food" | "grocery" | "pharmacy" | "ecommerce" | string;

export interface StoreModule {
    id: number;
    module_name: string;
    module_type: StoreModuleType;
    status: string;
    icon_full_url: string;
}

export type GetStoreModulesResponse = StoreModule[];
