/**
 * Store Status Information
 */
export interface StoreStatus {
  is_open: boolean;
  is_busy: boolean;
  busy_level: 'normal' | 'quiet' | 'busy' | 'very_busy';
  current_orders: number;
  estimated_wait_time: string | null;
  next_available_slot: string | null;
  delivery_available: boolean;
  takeaway_available: boolean;
  last_updated: string;
}

/**
 * Store Delivery Information
 */
export interface StoreDelivery {
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
  estimated_wait_time: string | null;
}

/**
 * Store Schedule for a Single Day
 */
export interface DaySchedule {
  opening_time: string;
  closing_time: string;
  is_open: boolean;
  break_start: string | null;
  break_end: string | null;
}

/**
 * Store Weekly Schedule
 */
export interface StoreSchedule {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}

/**
 * Store Badge
 */
export interface StoreBadge {
  type: string;
  label: string;
  label_ar: string;
  icon: string | null;
  color: string;
}

/**
 * Store Tag
 */
export interface StoreTag {
  id: number;
  name: string;
  name_ar?: string;
}

/**
 * Translation
 */
export interface Translation {
  id: number;
  translationable_type: string;
  translationable_id: number;
  locale: string;
  key: string;
  value: string;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Storage Information
 */
export interface Storage {
  id: number;
  data_type: string;
  data_id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

/**
 * Module Information (embedded in Store)
 */
export interface StoreModule {
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
  storage: Storage[];
  translations: Translation[];
}

/**
 * Store Schedule Entry (from database)
 */
export interface StoreScheduleEntry {
  id: number;
  store_id: number;
  day: number; // 0 = Sunday, 1 = Monday, etc.
  opening_time: string;
  closing_time: string;
  created_at: string;
  updated_at: string;
}

/**
 * Store Discount
 */
export interface StoreDiscount {
  id: number;
  type: string;
  value: number;
  min_purchase?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
}

/**
 * Main Store Type
 */
export interface Store {
  id: number;
  external_store_id: string;
  name: string;
  phone: string;
  email: string | null;
  logo: string;
  latitude: string;
  longitude: string;
  address: string;
  footer_text: string | null;
  minimum_order: number;
  comission: number | null;
  schedule_order: boolean;
  status: StoreStatus;
  vendor_id: number;
  store_group_id: number | null;
  admin_aprove: number;
  created_at: string;
  updated_at: string;
  free_delivery: boolean;
  rating_count: number;
  avg_rating: number;
  cover_photo: string;
  delivery: StoreDelivery;
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
  order_place_to_schedule_interval: number;
  featured: number;
  per_km_shipping_charge: number;
  first_km_fee: number;
  first_km_distance: number;
  prescription_order: boolean;
  slug: string;
  maximum_shipping_charge: number;
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
  min_delivery_time: string;
  reviews_count: number;
  orders_count: number;
  category_ids: number[];
  discount_status: boolean;
  ratings: number[]; // [1-star count, 2-star count, 3-star count, 4-star count, 5-star count]
  positive_rating: number;
  total_items: number;
  total_campaigns: number;
  is_recommended: boolean;
  halal_tag_status: boolean;
  extra_packaging_status: boolean;
  extra_packaging_amount: number;
  current_opening_time: string;
  schedule: StoreSchedule;
  is_open_now: boolean;
  next_opening_time: string;
  next_closing_time: string;
  timezone: string;
  badges: StoreBadge[];
  tags: StoreTag[];
  gst_status: boolean;
  gst_code: string;
  logo_full_url: string;
  cover_photo_full_url: string;
  meta_image_full_url: string;
  discount: StoreDiscount | null;
  translations: Translation[];
  storage: Storage[];
  module: StoreModule;
  schedules: StoreScheduleEntry[];
}

/**
 * Store List Response
 */
export interface StoreList {
  total_size: number;
  limit: number;
  offset: number;
  stores: Store[];
}

/**
 * Store Filters
 */
export interface StoreFilters {
  module_id?: number;
  zone_id?: number;
  category_id?: number;
  featured?: boolean;
  popular?: boolean;
  type?: 'all' | 'veg' | 'non_veg';
  rating?: number; // minimum rating
  is_open?: boolean;
  free_delivery?: boolean;
  sort_by?: 'distance' | 'rating' | 'delivery_time' | 'minimum_order';
  search?: string;
  latitude?: number;
  longitude?: number;
}