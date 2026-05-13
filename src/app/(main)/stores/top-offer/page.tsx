import { MapPin } from "lucide-react";
import { AllStoresPage } from "@/features/categories/components/store/AllStoresPage";

export const metadata = {
    title: "العروض الأفضل قربك | العروض الأفضل قربك",
    description: "اكتشف العروض الأفضل قربك",
};

export default function TopOfferNearMePage() {
    return (
        <AllStoresPage
            endpoint="top-offer"
            title="العروض الأفضل قربك"
            subtitle="العروض الأفضل قربك"
            icon={<MapPin className="w-5 h-5 text-white" />}
            accentFrom="from-cyan-500"
            accentTo="to-teal-600"
        />
    );
}