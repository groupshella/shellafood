import { ThumbsUp } from "lucide-react";
import { AllStoresPage } from "@/features/categories/components/store/AllStoresPage";

export const metadata = {
  title: "المتاجر الموصى بها | المتاجر التي تم اختيارها لك",
  description: "المتاجر التي تم اختيارها لك بناء على موقعك.",
};

export default function RecommendedStoresPage() {
  return (
    <AllStoresPage
      endpoint="recommended"
      title="المتاجر الموصى بها"
      subtitle="المتاجر التي تم اختيارها لك بناء على موقعك"
      icon={<ThumbsUp className="w-5 h-5 text-white" />}
      accentFrom="from-green-500"
      accentTo="to-emerald-600"
    />
  );
}