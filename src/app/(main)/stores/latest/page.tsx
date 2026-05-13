import { Sparkles } from "lucide-react";
import { AllStoresPage } from "@/features/categories/components/store/AllStoresPage";

export const metadata = {
  title: "المتاجر الجديدة | المتاجر التي ظهرت مؤخراً",
  description: "اكتشف المتاجر التي ظهرت مؤخراً",
};

export default function LatestStoresPage() {
  return (
    <AllStoresPage
      endpoint="latest"
      title="المتاجر الجديدة"
      subtitle="المتاجر التي ظهرت مؤخراً"
      icon={<Sparkles className="w-5 h-5 text-white" />}
      accentFrom="from-violet-500"
      accentTo="to-purple-600"
    />
  );
}