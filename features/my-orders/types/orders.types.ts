export type OrderStatus = "preparing" | "completed" | "cancelled";
export type OrderModule = "all" | "restaurants" | "hyper" | "cafes";

export interface OrderItem {
    id: number;
    name: string;
    description: string;
    price: string;
    originalPrice?: string;
    quantity: number;
    imageUrl?: string;
}

export interface Order {
    id: number;
    storeName: string;
    storeDescription: string;
    orderNum: string;
    date: string;
    orderDate: string;
    status: OrderStatus;
    total: string;
    subtotal: string;
    deliveryFee: string;
    serviceFee: string;
    discount: string;
    items: OrderItem[];
    module: Omit<OrderModule, "all">;
    paymentMethod: string;
    orderAddress: string;
}

export interface FilterState {
    date: string;
    timePeriod: string | null;
    statuses: OrderStatus[];
}
