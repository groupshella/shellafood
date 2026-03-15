
  
 
  export interface ItemUnit {
    id: number;
    unit: string; // مثل "قطعة"
    created_at: string;
    updated_at: string;
    translations: any[];
  }
  
 
  export interface DietaryInfo {
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
  

  export interface Availability {
    is_available: boolean;
    is_available_now: boolean;
    available_quantity: number;
    stock_status: 'in_stock' | 'out_of_stock'; // يمكن أن يكون له قيم محددة
    estimated_preparation_time: string;
    unavailable_until: string | null;
    available_time_starts: string;
    available_time_ends: string;
    available_days: string[]; // أيام الأسبوع
    next_available_time: string | null;
    seasonal: boolean;
    season_start: string | null;
    season_end: string | null;
  }
  
  
  export interface Item {
    id: number;
    name: string;
    description: string;
    image: string; // URL للصورة
    category_id: number;
    brand_id: number;
    category_ids: Array<{ id: string; position: number; name: string }>;
    variations: any[]; // لم يتم تحديد النوع بناءً على البيانات المقدمة
    add_ons: any[]; // لم يتم تحديد النوع بناءً على البيانات المقدمة
    attributes: any[]; // لم يتم تحديد النوع بناءً على البيانات المقدمة
    choice_options: any[]; // لم يتم تحديد النوع بناءً على البيانات المقدمة
    p_margin: number;
    price: number;
    cat_exclude: boolean;
    store_exclude: boolean;
    tax: number;
    tax_class_id: number | null;
    profit_class_id: number | null;
    tax_cal: string;
    tax_type: string;
    discount: number;
    discount_type: string;
    available_time_starts: string;
    available_time_ends: string;
    veg: number;
    status: number;
    store_id: number;
    created_at: string;
    updated_at: string;
    order_count: number;
    avg_rating: number;
    rating_count: number;
    module_id: number;
    item_site_id: string;
    stock: number;
    unit_id: number;
    images: Array<{ img: string; storage: string }>;
    food_variations: any[];
    slug: string;
    recommended: number;
    organic: number;
    maximum_cart_quantity: number;
    is_approved: number;
    is_halal: number;
    item_code: string;
    store_site_id: string;
    requires_customization: boolean;
    can_add_directly: boolean;
    presets: any[];
    module_type: string;
    store_name: string;
    is_campaign: number;
    zone_id: number;
    flash_sale: number;
    store_discount: number;
    schedule_order: boolean;
    delivery_time: string;
    free_delivery: boolean;
    unit: ItemUnit;
    min_delivery_time: number;
    max_delivery_time: number;
    common_condition_id: number;
    is_basic: number;
    is_prescription_required: number;
    halal_tag_status: number;
    original_price: number;
    highest_price_store_id: number;
    highest_price_store_name: string;
    highest_price: number;
    cheapest_available_store_id: number;
    cheapest_available_store_name: string;
    cheapest_available_price: number;
    delivery_store_id: number;
    total_available_stores: number;
    has_multiple_stores: boolean;
    nutritions_name: any[];
    allergies_name: any[];
    generic_name: any[];
    allergens: any[];
    allergen_free: boolean;
    contains_nuts: boolean;
    contains_gluten: boolean;
    contains_dairy: boolean;
    contains_eggs: boolean;
    dietary: DietaryInfo;
    tags: any[];
    availability: Availability;
    unit_type: string;
    image_full_url: string;
    images_full_url: string[];
    discounted_price: number;
    storage: Array<{
      id: number;
      data_type: string;
      data_id: string;
      key: string;
      value: string;
      created_at: string;
      updated_at: string;
    }>;
    translations: any[];
    module: any; // يمكن إنشاء interface منفصلة للـ module
    ecommerce_item_details: any | null;
    item_nutrition_value: any | null;
    allergies: any[];
  }
  

  export interface DepartmentResponse {
    products: Item[];
    total_size: number;
    offset: string;
    limit: number;
    has_more: boolean;
  }