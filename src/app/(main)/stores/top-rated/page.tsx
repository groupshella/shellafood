import { Star } from "lucide-react";
import { AllStoresPage } from "@/features/categories/components/store/AllStoresPage";

export const metadata = {
  title: "المتاجر الأعلى تقييماً | المتاجر الأعلى تقييماً",
  description: "اكتشف المتاجر الأعلى تقييماً",
};

export default function TopRatedStoresPage() {
  return (
    <AllStoresPage
      endpoint="top-rated"
      title="المتاجر الأعلى تقييماً"
      subtitle="المتاجر الأعلى تقييماً"
      icon={<Star className="w-5 h-5 text-white" />}
      accentFrom="from-amber-500"
      accentTo="to-yellow-500"
    />
  );
}