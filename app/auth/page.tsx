import AuthFlowPage from "@/features/auth/components/AuthFlowPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "تسجيل الدخول | شلة فود",
	description: "سجّل دخولك أو أنشئ حساباً جديداً للاستمتاع بخدمات شلة فود",
};

export default async function Page() {

	return <AuthFlowPage />;
}