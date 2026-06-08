import HomePage from "@/features/home/components/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "الرئيسية | شلة فود",
	description: "تصفّح العروض والمتاجر واطلب ما تحب من شلة فود",
};

export default function HomeRoute() {

    return <HomePage />
}