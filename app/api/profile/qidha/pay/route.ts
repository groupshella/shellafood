import { apiError } from "@/shared/lib/api-response";

export async function POST(req: Request) {
	const lang =
		req.headers.get("Accept-Language")?.toLowerCase().startsWith("en")
			? "en"
			: "ar";
	const isArabic = lang === "ar";
	return apiError(
		isArabic
			? "سداد المستحقات غير متاح حتى يتم توفير رقم الطلب من الخدمة"
			: "Due payment is unavailable until the service provides an order ID",
		501,
	);
}
