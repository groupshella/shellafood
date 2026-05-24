import { BookingStep } from "../types/booking.types";
/**
 * Get booking steps for stepper navigation
 * @param service - Service slug
 * @param serviceType - Service type slug
 * @returns Array of booking steps
 */
export function getBookingSteps(service: string): BookingStep[] {
	return [
		{
			id: "details",
			path: `/${service}/book/details`,
			label: "التفاصيل",
		},
		{
			id: "summary",
			path: `/${service}/book/summary`,
			label: "الملخص",
		},
		{
			id: "confirmation",
			path: `/${service}/book/confirmation`,
			label: "التأكيد",
		},
	];
}
export const FUEL_TYPES_OPTIONS =  [
		{ value: "gasoline", label:  "بنزين"  },
		{ value: "diesel", label:  "ديزل"},
		{ value: "hybrid", label:  "هجين" },
		{ value: "electric", label:  "كهربائي"  },
	]
export const GenerateYearOptions = ()=> {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 51 }, (_, i) => {
            const year = currentYear - i + 1;
            return { value: year.toString(), label: year.toString() };
        });
    }
export const CAR_MAKES_OPTIONS =  [
		{ value: "toyota", label: "تويوتا" },
		{ value: "hyundai", label: "هيونداي" },
		{ value: "ford", label: "فورد" },
		{ value: "chevrolet", label: "شيفروليه" },
		{ value: "nissan", label: "نيسان" },
		{ value: "honda", label: "هوندا" },
		{ value: "kia", label: "كيا" },
		{ value: "mitsubishi", label: "ميتسوبيشي" },
		{ value: "mercedes", label: "مرسيدس" },
		{ value: "bmw", label: "بي إم دبليو" },
		{ value: "audi", label: "أودي" },
		{ value: "volkswagen", label: "فولكس واجن" },
		{ value: "mazda", label: "مازدا" },
		{ value: "lexus", label: "لكزس" },
		{ value: "infiniti", label: "إنفينيتي" },
		{ value: "other", label: "أخرى" },
	]
export const TRANSMISSION_OPTIONS = 
 [
		{ value: "automatic", label: "أوتوماتيك" },
		{ value: "manual", label: "يدوي" },
	];
export const SERVICE_TYPES = [
	{ value: "maintenance", label: "صيانة السيارات" },
	{ value: "trade", label: "بيع وشراء السيارات" },
	{ value: "parts", label: "قطع الغيار" }
  ];
  
  export const SERVICE_SUBSPECIALTIES = {
	maintenance: [
	  { value: "mechanical", label: "صيانة ميكانيكا" },
	  { value: "electrical", label: "صيانة كهرباء" },
	  { value: "comprehensive", label: "صيانة دورية شاملة" },
	  { value: "bodywork", label: "سمكرة ودهان" }
	],
	trade: [
	  { value: "sell", label: "عرض سيارة للبيع" },
	  { value: "buy", label: "طلب شراء سيارة" }
	],
	parts: [
	  { value: "used", label: "قطع غيار تشليح/مستعمل" },
	  { value: "new", label: "قطع غيار جديدة" }
	]
  };