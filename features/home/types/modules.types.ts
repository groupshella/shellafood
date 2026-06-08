// ── Get Modules ───────────────────────────────────────────────────────────────

export type ModuleType = "food" | "grocery" | "pharmacy" | "ecommerce" | string;

interface ModuleStorage {
    id: number;
    data_type: string;
    data_id: string;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
}

interface ModuleTranslation {
    id: number;
    translationable_type: string;
    translationable_id: number;
    locale: string;
    key: string;
    value: string;
    created_at: string | null;
    updated_at: string | null;
}

export interface Module {
    id: number;
    module_name: string;
    module_type: ModuleType;
    icon: string;
    thumbnail: string;
    status: string;
    icon_full_url: string;
    thumbnail_full_url: string;
    storage: ModuleStorage[];
    translations: ModuleTranslation[];
}

export type GetModulesResponse = Module[];
