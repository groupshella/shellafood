
export type ModuleType = "food" | "grocery" | "pharmacy" | "ecommerce" | string;

export interface Module {
    id: number;
    module_name: string;
    module_type: ModuleType;
    status: string;
    icon_full_url: string;
}

export type GetModulesResponse = Module[];
