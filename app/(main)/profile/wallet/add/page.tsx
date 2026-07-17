import { AddBalanceClient } from "@/features/profile/components/sections/MyWallet/AddBalanceClient";
import { isArabicLocale } from "@/shared/lib/locale";

export const metadata = {
    title: "إضافة رصيد | شيلة فود",
    description: "أضف رصيدًا إلى محفظتك",
};

export default async function AddBalancePage() {
    const isArabic = await isArabicLocale();
    return <AddBalanceClient isArabic={isArabic} />;
}
