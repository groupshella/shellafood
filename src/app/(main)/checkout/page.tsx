import { CheckoutPage } from "@/features/checkout/components/CheckoutPage";

export default function CheckoutRoute() {
    const storeId = 1;
    const orderAmount = 12;
    const distance = 1;
    const storeNme = "name";
    const itemCount = 2;
    return <CheckoutPage storeId={storeId} orderAmount={orderAmount} distance={distance} storeName={storeNme} itemCount={itemCount} />
}