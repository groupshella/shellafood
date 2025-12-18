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
// Main Store Type (with category_details added)
export interface StoreDetails {
    id: number;
    external_store_id: number | null;
    name: string;
    phone: string;
    email: string;
    logo: string;
    latitude: string;
    longitude: string;
    address: string;
    footer_text: string | null;
    minimum_order: number;
    comission: number | null;
    schedule_order: boolean;
    status: Status;
    vendor_id: number;
    store_group_id: number | null;
    admin_aprove: number;
    created_at: string;
    updated_at: string;
    free_delivery: boolean;
    rating_count: number;
    avg_rating: number;
    cover_photo: string;
    delivery: DeliveryInfo;
    take_away: boolean;
    item_section: boolean;
    tax: number;
    deliveryfee_tax: number;
    tax_cal: string;
    zone_id: number;
    reviews_section: boolean;
    active: boolean;
    self_delivery_system: number;
    pos_system: boolean;
    minimum_shipping_charge: number;
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
    prescription_order: boolean;
    slug: string;
    maximum_shipping_charge: number | null;
    cutlery: boolean;
    meta_title: string | null;
    meta_description: string | null;
    meta_image: string | null;
    announcement: number;
    announcement_message: string | null;
    store_business_model: string;
    package_id: number | null;
    pickup_zone_id: string;
    comment: string | null;
    p_margin: number;
    off_day: string;
    open: number;
    distance: number;
    reviews_comments_count: number;
    is_recommended: boolean;
    minimum_stock_for_warning: number;
    halal_tag_status: boolean;
    extra_packaging_status: boolean;
    extra_packaging_amount: number;
    ratings: number[];
    positive_rating: number;
    total_items: number;
    total_campaigns: number;
    current_opening_time: string;
    schedule: Schedule;
    is_open_now: boolean;
    next_opening_time: string;
    next_closing_time: string;
    timezone: string;
    badges: any[];
    tags: any[];
    category_ids: number[];
    category_details: CategoryDetail[]; // <--- NEW FIELD
    categories_pagination: CategoriesPagination;
    price_range: PriceRange;
    combos: any[];
    gst_status: boolean;
    gst_code: string;
    logo_full_url: string;
    cover_photo_full_url: string;
    meta_image_full_url: string;
    discount: any | null;
    schedules: StoreSchedule[];
    active_coupons: any[];
    store_sub: any | null;
    translations: Translation[];
    storage: StorageItem[];
    module: Module;
}