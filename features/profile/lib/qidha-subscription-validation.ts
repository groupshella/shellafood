import type { QidhaSubscriptionFormData } from "@/features/profile/types/qidha-subscription.types";

export type QidhaFormField = keyof QidhaSubscriptionFormData | "general";

export type QidhaFieldErrors = Partial<Record<QidhaFormField, string>>;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
	"application/pdf",
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
]);

type Lang = "ar" | "en";

function required(value: string, message: string): string | undefined {
	if (!value.trim()) return message;
	return undefined;
}

function parseLooseDate(value: string): Date | null {
	const normalized = value.trim().replace(/\s*\/\s*/g, "-");
	const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (!match) return null;
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(year, month - 1, day);
	if (
		date.getFullYear() !== year ||
		date.getMonth() !== month - 1 ||
		date.getDate() !== day
	) {
		return null;
	}
	return date;
}

function ageFrom(date: Date): number {
	const today = new Date();
	let age = today.getFullYear() - date.getFullYear();
	const m = today.getMonth() - date.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age -= 1;
	return age;
}

export function validatePersonalStep(
	data: QidhaSubscriptionFormData,
	lang: Lang = "ar",
): QidhaFieldErrors {
	const isArabic = lang === "ar";
	const errors: QidhaFieldErrors = {};

	const firstName = required(
		data.firstName,
		isArabic ? "الاسم الأول مطلوب" : "First name is required",
	);
	if (firstName) errors.firstName = firstName;
	else if (data.firstName.trim().length < 2) {
		errors.firstName = isArabic ? "أدخل اسماً صالحاً" : "Enter a valid name";
	}

	const fatherName = required(
		data.fatherName,
		isArabic ? "اسم الأب مطلوب" : "Father's name is required",
	);
	if (fatherName) errors.fatherName = fatherName;

	const familyName = required(
		data.familyName,
		isArabic ? "اسم العائلة مطلوب" : "Family name is required",
	);
	if (familyName) errors.familyName = familyName;

	const birthDate = required(
		data.birthDate,
		isArabic ? "تاريخ الميلاد مطلوب" : "Date of birth is required",
	);
	if (birthDate) {
		errors.birthDate = birthDate;
	} else {
		const parsed = parseLooseDate(data.birthDate);
		if (!parsed) {
			errors.birthDate = isArabic
				? "صيغة التاريخ: yyyy-mm-dd"
				: "Date format: yyyy-mm-dd";
		} else if (ageFrom(parsed) < 18) {
			errors.birthDate = isArabic
				? "يجب أن يكون العمر 18 سنة فأكثر"
				: "You must be 18 years or older";
		}
	}

	if (
		required(
			data.nationality,
			isArabic ? "الجنسية مطلوبة" : "Nationality is required",
		)
	) {
		errors.nationality = isArabic
			? "الجنسية مطلوبة"
			: "Nationality is required";
	}

	if (
		required(
			data.maritalStatus,
			isArabic ? "الحالة الاجتماعية مطلوبة" : "Marital status is required",
		)
	) {
		errors.maritalStatus = isArabic
			? "الحالة الاجتماعية مطلوبة"
			: "Marital status is required";
	}

	const familyCount = required(
		data.familyCount,
		isArabic ? "عدد أفراد الأسرة مطلوب" : "Number of family members is required",
	);
	if (familyCount) {
		errors.familyCount = familyCount;
	} else {
		const n = Number(data.familyCount);
		if (!Number.isInteger(n) || n < 1) {
			errors.familyCount = isArabic
				? "أدخل عدداً صحيحاً (1 فأكثر)"
				: "Enter a whole number (1 or more)";
		}
	}

	const idNumber = required(
		data.idNumber,
		isArabic ? "رقم الهوية مطلوب" : "ID number is required",
	);
	if (idNumber) {
		errors.idNumber = idNumber;
	} else {
		const digits = data.idNumber.replace(/\D/g, "");
		if (digits.length < 10) {
			errors.idNumber = isArabic
				? "رقم الهوية يجب أن يكون 10 أرقام على الأقل"
				: "ID number must be at least 10 digits";
		}
	}

	const idExpiry = required(
		data.idExpiryDate,
		isArabic ? "تاريخ انتهاء الهوية مطلوب" : "ID expiry date is required",
	);
	if (idExpiry) {
		errors.idExpiryDate = idExpiry;
	} else {
		const parsed = parseLooseDate(data.idExpiryDate);
		if (!parsed) {
			errors.idExpiryDate = isArabic
				? "صيغة التاريخ: yyyy-mm-dd"
				: "Date format: yyyy-mm-dd";
		} else if (parsed.getTime() < Date.now()) {
			errors.idExpiryDate = isArabic
				? "تاريخ الانتهاء يجب أن يكون في المستقبل"
				: "Expiry date must be in the future";
		}
	}

	const phone = required(
		data.phone,
		isArabic ? "رقم الجوال مطلوب" : "Mobile number is required",
	);
	if (phone) {
		errors.phone = phone;
	} else {
		const local = data.phone
			.replace(/\D/g, "")
			.replace(/^00966/, "")
			.replace(/^966/, "")
			.replace(/^0/, "");
		if (!/^5\d{8}$/.test(local)) {
			errors.phone = isArabic
				? "أدخل رقم جوال سعودي صحيح (يبدأ بـ 5)"
				: "Enter a valid Saudi mobile number (starts with 5)";
		}
	}

	if (
		required(data.homeType, isArabic ? "نوع المنزل مطلوب" : "Home type is required")
	) {
		errors.homeType = isArabic ? "نوع المنزل مطلوب" : "Home type is required";
	}

	if (required(data.city, isArabic ? "المدينة مطلوبة" : "City is required")) {
		errors.city = isArabic ? "المدينة مطلوبة" : "City is required";
	}

	const neighborhood = required(
		data.neighborhood,
		isArabic ? "الحي مطلوب" : "Neighborhood is required",
	);
	if (neighborhood) errors.neighborhood = neighborhood;

	return errors;
}

export function validateIncomeStep(
	data: QidhaSubscriptionFormData,
	lang: Lang = "ar",
): QidhaFieldErrors {
	const isArabic = lang === "ar";
	const errors: QidhaFieldErrors = {};

	if (
		required(
			data.incomeSource,
			isArabic ? "مصدر الدخل مطلوب" : "Income source is required",
		)
	) {
		errors.incomeSource = isArabic
			? "مصدر الدخل مطلوب"
			: "Income source is required";
	}

	const employer = required(
		data.employerName,
		isArabic ? "اسم جهة العمل مطلوب" : "Employer name is required",
	);
	if (employer) errors.employerName = employer;

	const income = required(
		data.monthlyIncome,
		isArabic ? "الدخل الشهري مطلوب" : "Monthly income is required",
	);
	if (income) {
		errors.monthlyIncome = income;
	} else {
		const amount = Number(data.monthlyIncome.replace(/,/g, ""));
		if (!Number.isFinite(amount) || amount <= 0) {
			errors.monthlyIncome = isArabic
				? "أدخل مبلغاً صالحاً أكبر من صفر"
				: "Enter a valid amount greater than zero";
		}
	}

	if (
		required(data.salaryDay, isArabic ? "يوم الراتب مطلوب" : "Salary day is required")
	) {
		errors.salaryDay = isArabic ? "يوم الراتب مطلوب" : "Salary day is required";
	}

	if (
		required(
			data.hasInstallments,
			isArabic ? "يرجى تحديد وجود أقساط" : "Please indicate if you have installments",
		)
	) {
		errors.hasInstallments = isArabic
			? "يرجى تحديد وجود أقساط"
			: "Please indicate if you have installments";
	}

	if (!data.uploadedDoc?.file) {
		errors.uploadedDoc = isArabic
			? "يرجى إرفاق مستند واحد على الأقل"
			: "Please attach at least one document";
	} else {
		const file = data.uploadedDoc.file;
		if (file.size > MAX_FILE_BYTES) {
			errors.uploadedDoc = isArabic
				? "حجم الملف يجب ألا يتجاوز 5 ميجا"
				: "File size must not exceed 5MB";
		} else if (file.type && !ALLOWED_FILE_TYPES.has(file.type)) {
			errors.uploadedDoc = isArabic
				? "الصيغ المسموحة: PDF, JPG, PNG"
				: "Allowed formats: PDF, JPG, PNG";
		}
	}

	return errors;
}

/** Map backend validation keys to local form fields. */
export function mapBackendFieldErrors(errors: unknown): QidhaFieldErrors {
	if (!errors || typeof errors !== "object") return {};

	const alias: Record<string, QidhaFormField> = {
		first_name: "firstName",
		father_name: "fatherName",
		grandfather_name: "grandfatherName",
		last_name: "familyName",
		birth_date: "birthDate",
		nationality: "nationality",
		marital_status: "maritalStatus",
		number_of_family_members: "familyCount",
		national_id: "idNumber",
		identity_card_number: "idNumber",
		end_date: "idExpiryDate",
		mobile: "phone",
		house_type: "homeType",
		city: "city",
		neighborhood: "neighborhood",
		source_of_income: "incomeSource",
		name_of_employer: "employerName",
		total_salary: "monthlyIncome",
		monthly_amount: "monthlyIncome",
		salary_day: "salaryDay",
		installments: "hasInstallments",
		attachments: "uploadedDoc",
		"attachments[]": "uploadedDoc",
		general: "general",
		message: "general",
	};

	const out: QidhaFieldErrors = {};
	const entries = Array.isArray(errors)
		? (errors as unknown[]).map((item) => {
				if (!item || typeof item !== "object") return ["general", String(item)] as const;
				const row = item as Record<string, unknown>;
				const key = String(row.code ?? row.field ?? row.key ?? "general");
				const message = String(row.message ?? "");
				return [key, message] as const;
			})
		: Object.entries(errors as Record<string, unknown>).map(([key, value]) => {
				const message = Array.isArray(value)
					? String(value[0] ?? "")
					: String(value ?? "");
				return [key, message] as const;
			});

	const formFields = new Set<string>([
		"firstName",
		"fatherName",
		"grandfatherName",
		"familyName",
		"birthDate",
		"nationality",
		"maritalStatus",
		"familyCount",
		"idNumber",
		"idExpiryDate",
		"phone",
		"homeType",
		"city",
		"neighborhood",
		"incomeSource",
		"employerName",
		"monthlyIncome",
		"salaryDay",
		"hasInstallments",
		"uploadedDoc",
		"general",
	]);

	for (const [key, message] of entries) {
		if (!message) continue;
		const field = (alias[key] ??
			(formFields.has(key) ? key : "general")) as QidhaFormField;
		if (!out[field]) out[field] = message;
	}

	return out;
}

export function firstErrorKey(errors: QidhaFieldErrors): QidhaFormField | null {
	const keys = Object.keys(errors) as QidhaFormField[];
	return keys.find((k) => Boolean(errors[k])) ?? null;
}
