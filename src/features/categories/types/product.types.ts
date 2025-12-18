/* =========================
   PRODUCT ROOT
========================= */

export interface Product {
    id: number;
    name: string;
    description: string;
    slug: string;
  
    price: number;
    original_price: number;
    discounted_price: number;
  
    image: string;
    image_full_url: string;
    images_full_url: string[];
  
    category_id: number;
    category_ids: CategoryRef[];
  
    brand_id: number;
    module_id: number;
    module_type: string;
  
    store_id: number;
    store_name: string;
  
    stock: number;
    maximum_cart_quantity: number;
  
    status: 0 | 1;
    is_approved: 0 | 1;
    is_halal: 0 | 1;
  
    recommended: 0 | 1;
    organic: 0 | 1;
    veg: 0 | 1;
  
    tax: number;
    tax_type: "percent" | "amount";
    discount: number;
    discount_type: "percent" | "amount";
  
    available_time_starts: string;
    available_time_ends: string;
  
    order_count: number;
    avg_rating: number;
    rating_count: number;
  
    unit_id: number;
    unit_type: string;
    unit: Unit;
  
    availability: Availability;
    dietary: Dietary;
  
    images: ProductImage[];
    storage: Storage[];
  
    module: ModuleSummary;
  
    created_at: string;
    updated_at: string;
  
    variations: any[];
    add_ons: any[];
    attributes: any[];
    choice_options: any[];
    food_variations: any[];
    presets: any[];
    reviews: any[];
    translations: any[];
    tags: any[];
  
    recommended_items: Product[];
  }
  
  /* =========================
     CATEGORY
  ========================= */
  
  export interface CategoryRef {
    id: string;
    position: number;
    name: string;
  }
  
  /* =========================
     IMAGES
  ========================= */
  
  export interface ProductImage {
    img: string;
    storage: "url" | "public";
  }
  
  /* =========================
     AVAILABILITY
  ========================= */
  
  export interface Availability {
    is_available: boolean;
    is_available_now: boolean;
    available_quantity: number;
  
    stock_status: "in_stock" | "out_of_stock";
  
    estimated_preparation_time: string;
    unavailable_until: string | null;
  
    available_time_starts: string;
    available_time_ends: string;
  
    available_days: string[];
  
    next_available_time: string | null;
    seasonal: boolean;
    season_start: string | null;
    season_end: string | null;
  
    reason: string | null;
  }
  
  /* =========================
     DIETARY
  ========================= */
  
  export interface Dietary {
    is_vegetarian: boolean;
    is_vegan: boolean;
    is_halal: boolean;
    is_organic: boolean;
    is_gluten_free: boolean;
    is_dairy_free: boolean;
    is_nut_free: boolean;
    is_sugar_free: boolean;
    is_low_carb: boolean;
    is_keto: boolean;
    is_paleo: boolean;
  }
  
  /* =========================
     UNIT
  ========================= */
  
  export interface Unit {
    id: number;
    unit: string;
    created_at: string;
    updated_at: string;
    translations: any[];
  }
  
  /* =========================
     STORAGE
  ========================= */
  
  export interface Storage {
    id: number;
    data_type: string;
    data_id: string;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
  }
  
  /* =========================
     MODULE (EMBEDDED)
  ========================= */
  
  export interface ModuleSummary {
    id: number;
    module_name: string;
    module_type: string;
  
    status: "0" | "1";
    description: string;
  
    icon: string;
    thumbnail: string;
  
    icon_full_url: string;
    thumbnail_full_url: string;
  
    theme_id: number;
    all_zone_service: 0 | 1;
    stores_count: number;
  
    created_at: string;
    updated_at: string;
  
    storage: Storage[];
    translations: any[];
  }
  