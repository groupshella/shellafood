// ── Wishlist API (GET /api/v1/customer/wish-list) ─────────────────────────────

export interface WishlistCategoryRef {
    id: string;
    position: number;
    name: string;
}

export interface WishlistItemImage {
    img: string;
    storage: string;
}

export interface WishlistItemAvailability {
    is_available: boolean;
    is_available_now: boolean;
    available_quantity: number;
    stock_status: string;
    estimated_preparation_time: string;
    unavailable_until: string | null;
    reason: string | null;
    available_time_starts: string;
    available_time_ends: string;
    available_days: string[];
    next_available_time: string | null;
    seasonal: boolean;
    season_start: string | null;
    season_end: string | null;
}

export interface WishlistItemDietary {
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

export interface WishlistItemUnit {
    id: number;
    unit: string;
    created_at: string;
    updated_at: string;
    translations: unknown[];
}

export interface WishlistModule {
    id: number;
    module_name: string;
    module_type: string;
    thumbnail: string;
    status: string;
    stores_count: number;
    created_at: string;
    updated_at: string;
    icon: string;
    theme_id: number;
    description: string;
    all_zone_service: number;
    icon_full_url: string;
    thumbnail_full_url: string;
    translations: unknown[];
}

export interface WishlistEcommerceItemDetails {
    id: number;
    item_id: number;
    brand_id: number | null;
    created_at: string;
    updated_at: string;
    temp_product_id: number | null;
}

/** Full wishlist product object returned in `WishlistResponse.item` */
export interface FavoriteProduct {
    id: number;
    name: string;
    description: string;
    image: string;
    category_id: number;
    brand_id: number;
    category_ids: WishlistCategoryRef[];
    variations: unknown[];
    add_ons: unknown[];
    attributes: unknown[];
    choice_options: unknown[];
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
    images: WishlistItemImage[];
    food_variations: unknown[];
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
    presets: unknown[];
    store_name: string;
    is_campaign: number;
    module_type: string;
    zone_id: number;
    flash_sale: number;
    store_discount: number;
    schedule_order: boolean;
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
    nutritions_name: unknown[];
    allergies_name: unknown[];
    generic_name: unknown[];
    allergens: unknown[];
    allergen_free: boolean;
    contains_nuts: boolean;
    contains_gluten: boolean;
    contains_dairy: boolean;
    contains_eggs: boolean;
    dietary: WishlistItemDietary;
    tags: unknown[];
    availability: WishlistItemAvailability;
    /** When the item was added to the wishlist — used for date grouping */
    wishlisted_at: string;
    unit_type: string;
    image_full_url: string;
    images_full_url: string[];
    discounted_price: number;
    has_variations: boolean;
    unit: WishlistItemUnit;
    storage: unknown[];
    translations: unknown[];
    module: WishlistModule;
    ecommerce_item_details: WishlistEcommerceItemDetails | null;
    item_nutrition_value: unknown | null;
}

/** Full wishlist store object returned in `WishlistResponse.store` */
export interface FavoriteStore {
    id: number;
    external_store_id: number | null;
    name: string;
    phone: string;
    email: string;
    logo: string;
    latitude: number;
    longitude: number;
    address: string;
    footer_text: string | null;
    minimum_order: number;
    comission: number | null;
    schedule_order: number;
    status: number;
    vendor_id: number;
    store_group_id: number | null;
    admin_aprove: number;
    created_at: string;
    updated_at: string;
    free_delivery: boolean;
    rating_count: number;
    avg_rating: number;
    cover_photo: string;
    delivery: number;
    take_away: number;
    item_section: number;
    tax: string;
    deliveryfee_tax: number;
    tax_cal: string;
    zone_id: number;
    reviews_section: number;
    active: boolean;
    busy_mode: number;
    gst: string;
    commercial_registration_number: string;
    commercial_registration_name: string;
    self_delivery_system: number;
    pos_system: number;
    minimum_shipping_charge: number;
    delivery_time: string;
    veg: number;
    non_veg: number;
    order_count: number;
    total_order: number;
    module_id: number;
    order_place_to_schedule_interval: number;
    featured: number;
    per_km_shipping_charge: number;
    first_km_fee: number;
    first_km_distance: number;
    prescription_order: number;
    slug: string;
    maximum_shipping_charge: number;
    cutlery: number;
    meta_title: string;
    meta_description: string;
    meta_image: string | null;
    announcement: number;
    announcement_message: string;
    store_business_model: string;
    package_id: number | null;
    pickup_zone_id: string;
    comment: string | null;
    p_margin: string;
    version_hash: string;
    off_day: string | null;
    /** When the store was added to the wishlist — used for date grouping */
    wishlisted_at?: string;
    module_type?: string;
}

export interface WishlistResponse {
    item: FavoriteProduct[];
    store: FavoriteStore[];
}

// ── Orders tab (GET /api/v1/customer/order/list) ─────────────────────────────

export interface ApiOrder {
    id: number;
    order_status: string;
    order_amount: number;
    wishlisted_at: string;
    updated_at: string;
    restaurant?: {
        id: number;
        name: string;
        logo_full_url: string;
    };
    store?: {
        id: number;
        name: string;
        logo_full_url: string;
    };
    order_note?: string | null;
    delivery_address?: { address: string } | null;
    details_count?: number;
    order_time?: string;
    schedule_at?: string | null;
}

export interface OrderListResponse {
    total_size: number;
    limit: string;
    offset: number;
    orders: ApiOrder[];
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

export type FavoritesTab = "products" | "stores" | "orders";
