import type { Metadata } from "next";
import { NotFoundContent } from "./NotFoundContent";

export const metadata: Metadata = {
    title: "الصفحة غير موجودة | شلة فود",
    description: "لم نتمكن من العثور على الصفحة المطلوبة. عد إلى الرئيسية أو ابحث في شلة فود.",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return <NotFoundContent />;
}
