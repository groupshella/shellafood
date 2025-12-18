export interface Module {
    id: number;
  
    module_name: string;
    module_type: string; // ecommerce | food | grocery | pharmacy | etc
  
    description: string;
    status: "0" | "1";
  
    icon: string;
    icon_full_url: string;
  
    thumbnail: string;
    thumbnail_full_url: string;
  
    stores_count: number;
    items_count: number;
  
    theme_id: number;
    all_zone_service: 0 | 1;
  
    created_at: string;
    updated_at: string;
  
    zones: Zone[];
    translations: Translation[];
  }
  export interface Zone {
    id: number;
  
    name: string;
    display_name: string | null;
  
    status: 0 | 1;
  
    coordinates: GeoPolygon;
  
    store_wise_topic: string;
    customer_wise_topic: string;
    deliveryman_wise_topic: string;
  
    cash_on_delivery: boolean;
    digital_payment: boolean;
    offline_payment: boolean;
  
    increased_delivery_fee: number;
    increased_delivery_fee_status: number;
    increase_delivery_charge_message: string | null;
  
    created_at: string;
    updated_at: string;
  
    pivot: ZonePivot;
    translations: Translation[];
  }
  export interface GeoPolygon {
    type: "Polygon";
    coordinates: number[][][]; 
    // [[[lng, lat], [lng, lat], ...]]
  }
  export interface ZonePivot {
    module_id: number;
    zone_id: number;
  
    per_km_shipping_charge: number;
  
    minimum_shipping_charge: number | null;
    maximum_shipping_charge: number | null;
  
    first_km_fee: number;
    first_km_distance: number;
  }
  export interface Translation {
    id: number;
  
    locale: string; // ar, en, etc
    key: string;    // name, description, etc
    value: string;
  
    created_at: string | null;
    updated_at: string | null;
  }
  export interface ZoneDataModule {
    id: number;
    module_name: string;
    module_type: string;
    thumbnail: string;
    status: "0" | "1";
    stores_count: number;
    created_at: string;
    updated_at: string;
    icon: string;
    theme_id: number;
    description: string;
    all_zone_service: 0 | 1;
    icon_full_url: string;
    thumbnail_full_url: string;
    pivot: ZoneDataModulePivot;
    storage: Array<{
      id: number;
      data_type: string;
      data_id: string;
      key: string;
      value: string;
      created_at: string;
      updated_at: string;
    }>;
    translations: Translation[];
  }

  export interface ZoneDataModulePivot {
    zone_id: number;
    module_id: number;
    per_km_shipping_charge: number;
    minimum_shipping_charge: number | null;
    maximum_shipping_charge: number | null;
    maximum_cod_order_amount: number | null;
    first_km_fee: number;
    first_km_distance: number;
  }

  export interface ZoneDataItem {
    id: number;
    name: string;
    coordinates: GeoPolygon;
    status: 0 | 1;
    created_at: string;
    updated_at: string;
    store_wise_topic: string;
    customer_wise_topic: string;
    deliveryman_wise_topic: string;
    cash_on_delivery: boolean;
    digital_payment: boolean;
    increased_delivery_fee: number;
    increased_delivery_fee_status: number;
    increase_delivery_charge_message: string | null;
    offline_payment: boolean;
    display_name: string | null;
    area: number;
    modules: ZoneDataModule[];
    translations: Translation[];
  }

  export interface ZoneData {
    zone_id: string;
    zone_data: ZoneDataItem[];
  }
        