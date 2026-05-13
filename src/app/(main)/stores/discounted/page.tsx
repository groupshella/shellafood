import { Tag } from "lucide-react";
import { AllStoresPage } from "@/features/categories/components/store/AllStoresPage";

export const metadata = {
    title: "Discounted Stores | Great Deals",
    description: "Stores running active discounts and promotions.",
};

export default function DiscountedStoresPage() {
    return (
        <AllStoresPage
            endpoint="discounted"
            title="العروض والخصومات"
            subtitle="المتاجر التي تقدم عروض وخصومات حالياً"
            icon={<Tag className="w-5 h-5 text-white" />}
            accentFrom="from-pink-500"
            accentTo="to-rose-600"
        />
    );
}