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

export function validatePersonalStep(data: QidhaSubscriptionFormData): QidhaFieldErrors {
    const errors: QidhaFieldErrors = {};

    const firstName = required(data.firstName, "الاسم الأول مطلوب");
    if (firstName) errors.firstName = firstName;
    else if (data.firstName.trim().length < 2) errors.firstName = "أدخل اسماً صالحاً";

    const fatherName = required(data.fatherName, "اسم الأب مطلوب");
    if (fatherName) errors.fatherName = fatherName;

    const familyName = required(data.familyName, "اسم العائلة مطلوب");
    if (familyName) errors.familyName = familyName;

    const birthDate = required(data.birthDate, "تاريخ الميلاد مطلوب");
    if (birthDate) {
        errors.birthDate = birthDate;
    } else {
        const parsed = parseLooseDate(data.birthDate);
        if (!parsed) errors.birthDate = "صيغة التاريخ: yyyy-mm-dd";
        else if (ageFrom(parsed) < 18) errors.birthDate = "يجب أن يكون العمر 18 سنة فأكثر";
    }

    if (required(data.nationality, "الجنسية مطلوبة")) {
        errors.nationality = "الجنسية مطلوبة";
    }

    if (required(data.maritalStatus, "الحالة الاجتماعية مطلوبة")) {
        errors.maritalStatus = "الحالة الاجتماعية مطلوبة";
    }

    const familyCount = required(data.familyCount, "عدد أفراد الأسرة مطلوب");
    if (familyCount) {
        errors.familyCount = familyCount;
    } else {
        const n = Number(data.familyCount);
        if (!Number.isInteger(n) || n < 1) {
            errors.familyCount = "أدخل عدداً صحيحاً (1 فأكثر)";
        }
    }

    const idNumber = required(data.idNumber, "رقم الهوية مطلوب");
    if (idNumber) {
        errors.idNumber = idNumber;
    } else {
        const digits = data.idNumber.replace(/\D/g, "");
        if (digits.length < 10) errors.idNumber = "رقم الهوية يجب أن يكون 10 أرقام على الأقل";
    }

    const idExpiry = required(data.idExpiryDate, "تاريخ انتهاء الهوية مطلوب");
    if (idExpiry) {
        errors.idExpiryDate = idExpiry;
    } else {
        const parsed = parseLooseDate(data.idExpiryDate);
        if (!parsed) errors.idExpiryDate = "صيغة التاريخ: yyyy-mm-dd";
        else if (parsed.getTime() < Date.now()) {
            errors.idExpiryDate = "تاريخ الانتهاء يجب أن يكون في المستقبل";
        }
    }

    const phone = required(data.phone, "رقم الجوال مطلوب");
    if (phone) {
        errors.phone = phone;
    } else {
        const local = data.phone.replace(/\D/g, "").replace(/^966/, "");
        if (!/^5\d{8}$/.test(local)) {
            errors.phone = "أدخل رقم جوال سعودي صحيح (يبدأ بـ 5)";
        }
    }

    if (required(data.homeType, "نوع المنزل مطلوب")) {
        errors.homeType = "نوع المنزل مطلوب";
    }

    if (required(data.city, "المدينة مطلوبة")) {
        errors.city = "المدينة مطلوبة";
    }

    const neighborhood = required(data.neighborhood, "الحي مطلوب");
    if (neighborhood) errors.neighborhood = neighborhood;

    return errors;
}

export function validateIncomeStep(data: QidhaSubscriptionFormData): QidhaFieldErrors {
    const errors: QidhaFieldErrors = {};

    if (required(data.incomeSource, "مصدر الدخل مطلوب")) {
        errors.incomeSource = "مصدر الدخل مطلوب";
    }

    const employer = required(data.employerName, "اسم جهة العمل مطلوب");
    if (employer) errors.employerName = employer;

    const income = required(data.monthlyIncome, "الدخل الشهري مطلوب");
    if (income) {
        errors.monthlyIncome = income;
    } else {
        const amount = Number(data.monthlyIncome.replace(/,/g, ""));
        if (!Number.isFinite(amount) || amount <= 0) {
            errors.monthlyIncome = "أدخل مبلغاً صالحاً أكبر من صفر";
        }
    }

    if (required(data.salaryDay, "يوم الراتب مطلوب")) {
        errors.salaryDay = "يوم الراتب مطلوب";
    }

    if (required(data.hasInstallments, "يرجى تحديد وجود أقساط")) {
        errors.hasInstallments = "يرجى تحديد وجود أقساط";
    }

    if (!data.uploadedDoc?.file) {
        errors.uploadedDoc = "يرجى إرفاق مستند واحد على الأقل";
    } else {
        const file = data.uploadedDoc.file;
        if (file.size > MAX_FILE_BYTES) {
            errors.uploadedDoc = "حجم الملف يجب ألا يتجاوز 5 ميجا";
        } else if (file.type && !ALLOWED_FILE_TYPES.has(file.type)) {
            errors.uploadedDoc = "الصيغ المسموحة: PDF, JPG, PNG";
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
