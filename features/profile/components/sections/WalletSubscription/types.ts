export interface WalletFormData {
    // Personal info
    firstName: string;
    fatherName: string;
    grandfatherName: string;
    familyName: string;
    birthDate: string;
    nationality: string;
    maritalStatus: string;
    familyCount: string;
    idNumber: string;
    idExpiryDate: string;
    phone: string;
    homeType: string;
    city: string;
    neighborhood: string;
    // Income
    incomeSource: string;
    employerName: string;
    monthlyIncome: string;
    salaryDay: string;
    hasInstallments: string;
    uploadedDoc: { file: File; previewName: string } | null;
}
