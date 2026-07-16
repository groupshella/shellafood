import type { QidhaSubscriptionFormData } from "@/features/profile/types/qidha-subscription.types";

function normalizeDate(value: string): string {
    return value.trim().replace(/\s*\/\s*/g, "-");
}

function mapInstallments(value: string): string {
    const normalized = value.trim().toLowerCase();
    if (value === "نعم" || normalized === "yes" || normalized === "1") return "1";
    if (value === "لا" || normalized === "no" || normalized === "0") return "0";
    return value.trim();
}

/**
 * Builds multipart fields for POST /api/qidha-wallet/store
 * matching the Flutter Raw Dio payload.
 */
export function buildQidhaStoreFormData(data: QidhaSubscriptionFormData): FormData {
    const fd = new FormData();
    const idNumber = data.idNumber.trim();
    const salary = data.monthlyIncome.trim();

    const fields: Record<string, string> = {
        first_name: data.firstName.trim(),
        grandfather_name: data.grandfatherName.trim(),
        father_name: data.fatherName.trim(),
        last_name: data.familyName.trim(),
        birth_date: normalizeDate(data.birthDate),
        national_id: idNumber,
        nationality: data.nationality.trim(),
        marital_status: data.maritalStatus.trim(),
        number_of_family_members: data.familyCount.trim(),
        identity_card_number: idNumber,
        end_date: normalizeDate(data.idExpiryDate),
        mobile: data.phone.trim(),
        house_type: data.homeType.trim(),
        city: data.city.trim(),
        neighborhood: data.neighborhood.trim(),
        name_of_employer: data.employerName.trim(),
        total_salary: salary,
        installments: mapInstallments(data.hasInstallments),
        source_of_income: data.incomeSource.trim(),
        monthly_amount: salary,
        salary_day: data.salaryDay.trim(),
    };

    for (const [key, value] of Object.entries(fields)) {
        fd.append(key, value);
    }

    if (data.uploadedDoc?.file) {
        fd.append("attachments[]", data.uploadedDoc.file, data.uploadedDoc.previewName);
    }

    return fd;
}
