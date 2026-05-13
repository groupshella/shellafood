import { TrendingUp } from "lucide-react";
import { AllStoresPage } from "@/features/categories/components/store/AllStoresPage";

export const metadata = {
  title: "المتاجر الشائعة | المتاجر التي طلبت منها أكثر هذا الأسبوع",
  description: "اكتشف المتاجر التي طلبت منها أكثر هذا الأسبوع",
};

export default function PopularStoresPage() {
  return (
    <AllStoresPage
      endpoint="popular"
      title="المتاجر الشائعة"
      subtitle="المتاجر التي طلبت منها أكثر هذا الأسبوع"
      icon={<TrendingUp className="w-5 h-5 text-white" />}
      accentFrom="from-orange-500"
      accentTo="to-red-500"
    />
  );
} 