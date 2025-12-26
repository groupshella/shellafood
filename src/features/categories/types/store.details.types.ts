interface Translation {
    id: number;
    translationable_type: string;
    translationable_id: number;
    locale: string;
    key: string | null;
    value: string | null;
    created_at: string | null;
    updated_at: string | null;
}

interface StorageItem {
    id: number;
    data_type: string;
    data_id: string;
    key: string;
    value: string;
    created_at: string;
    updated_at: string;
}

interface Module {
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
    storage: StorageItem[];
    translations: Translation[];
}

interface ScheduleDay {
    opening_time: string;
    closing_time: string;
    is_open: boolean;
    break_start: string | null;
    break_end: string | null;
}

interface Schedule {
    sunday: ScheduleDay;
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
    saturday: ScheduleDay;
}

interface DeliveryInfo {
    delivery_available: boolean;
    delivery_time_range: string;
    minimum_delivery_time: number;
    maximum_delivery_time: number;
    delivery_radius: number;
    delivery_fee: number;
    free_delivery_threshold: number;
    takeaway_available: boolean;
    takeaway_time: string;
    dine_in_available: boolean;
    preparation_time: string;
    estimated_wait_time: string;
}

interface Status {
    is_open: boolean;
    is_busy: boolean;
    busy_level: string;
    current_orders: number;
    estimated_wait_time: string;
    next_available_slot: string | null;
    delivery_available: boolean;
    takeaway_available: boolean;
    last_updated: string;
}

interface PriceRange {
    min_price: number;
    max_price: number;
    unit_type: string | null;
    image_full_url: string;
    images_full_url: any[];
    discounted_price: number | null;
    original_price: number | null;
    unit: string | null;
    storage: any[];
}

interface StoreSchedule {
    id: number;
    store_id: number;
    day: number;
    opening_time: string;
    closing_time: string;
    created_at: string;
    updated_at: string;
}

// NEW TYPE FOR CATEGORY DETAILS
export interface CategoryDetail {
    id: number;
    name: string;
    image: string;
    parent_id: number;
    position: number;
    status: number;
    created_at: string;
    updated_at: string;
    priority: number;
    module_id: number;
    cat_site_id: string;
    slug: string;
    featured: number;
    name_ar: string;
    name_en: string;
    image_full_url: string;
    storage: StorageItem[];
    translations: Translation[];
}

    export interface CategoriesPagination {
        total_categories: number;
        limit: number;
        offset: number;
        has_more: boolean;
    }
// Simplified CategoryDetail for API response
export interface CategoryDetailSimple {
    id: number;
    name: string;
}

// Main Store Type (updated to match actual API response)
export interface StoreDetails {
    id: number;
    external_store_id: string | null;
    name: string;
    phone: string;
    email: string | null;
    logo: string;
    latitude: string;
    longitude: string;
    address: string | null;
    footer_text: string | null;
    minimum_order: string;
    comission: number | null;
    schedule_order: number;
    status: number;
    vendor_id: number;
    store_group_id: number | null;
    admin_aprove: number;
    created_at: string;
    updated_at: string;
    free_delivery: number;
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
    active: number;
    gst: number | null;
    self_delivery_system: number;
    pos_system: number;
    minimum_shipping_charge: string;
    delivery_time: string;
    veg: number;
    non_veg: number;
    order_count: number;
    total_order: number;
    module_id: number;
    order_place_to_schedule_interval: number | null;
    featured: number;
    per_km_shipping_charge: number;
    first_km_fee: number;
    first_km_distance: number;
    prescription_order: number;
    slug: string;
    maximum_shipping_charge: number | null;
    cutlery: number;
    meta_title: string | null;
    meta_description: string | null;
    meta_image: string | null;
    announcement: number;
    announcement_message: string | null;
    store_business_model: string;
    package_id: number | null;
    pickup_zone_id: string;
    comment: string | null;
    p_margin: string;
    version_hash: string;
    off_day: string;
    location: string;
    open: number;
    distance: number;
    min_delivery_time: string;
    reviews_comments_count: number;
    category_ids: number[];
    category_details: CategoryDetailSimple[];
    price_range: PriceRange;
    categories_pagination: CategoriesPagination;
    combos: any[];
    is_recommended: boolean;
    minimum_stock_for_warning: number;
    halal_tag_status: boolean;
    extra_packaging_status: boolean;
    extra_packaging_amount: number;
    ratings: number[];
    positive_rating: number;
    total_items: number;
    total_campaigns: number | null;
    current_opening_time: string;
    schedule: Schedule;
    is_open_now: boolean;
    next_opening_time: string;
    next_closing_time: string;
    timezone: string;
    discount: any | null;
    schedules: StoreSchedule[];
    storage: StorageItem[];
    translations: Translation[];
    module: Module;
    // Computed/derived fields (may need to be added by API or computed client-side)
    logo_full_url?: string;
    cover_photo_full_url?: string;
    meta_image_full_url?: string;
    active_coupons?: any[];
    store_sub?: any | null;
}