/** Join-as-driver / voucher-rep registration copy. */
export const JOIN_STRINGS = {
    driverTitle: "انضم كرجل توصيل",
    driverSubtitle: "خطوات بسيطة لتكون بمثابة رجل التسليم",
    voucherTitle: "انضم كمندوب تسويق",
    voucherSubtitle: "خطوات بسيطة لتصبح مندوب تسويق قسائم شرائية",

    yourProfile: "ملفك التعريفي",
    personalId: "الهوية الشخصية",
    documents: "المستندات",
    documentsDesc:
        "يرجى رفع صورة الهوية أو عقد الإيجار، مع التأكد من وضوح المستند وكتابة اسم الملف بشكل صحيح.",

    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    email: "البريد الالكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    phone: "رقم الهاتف",

    addProfilePhoto: "أضف صورة لملفك التعريفي",
    addIdPhoto: "أضف صورة للهوية الشخصية",
    chooseFile: "اختر ملفاً وأضفه",
    uploadHelper: "برجاء التأكد أن الصورة واضحة وبحد أقصى 2 ميجا.",

    chooseWorkType: "اختر نوع العمل",
    chooseAddress: "اختر العنوان",
    chooseDeliveryMethod: "اختر وسيلة التوصيل",
    chooseIdType: "اختر نوع الهوية",

    agreeTerms: "أوافق على الشروط وسياسة الخصوصية",

    send: "ارسال",

    fileName: "اسم الصورة",
    fileSize: (size: string) => `حجم الصورة ${size}`,

    successTitle: "تم إرسال طلب انضمامك بنجاح",
    successSubtitle: "وسيتم التواصل معك قريباً",

    fileTooLarge: "حجم الملف يجب ألا يتجاوز 2 ميجا",
    requiredField: "هذا الحقل مطلوب",
    passwordMismatch: "كلمتا المرور غير متطابقتين",
    mustAgreeTerms: "يجب الموافقة على الشروط وسياسة الخصوصية",

    invalidPhone: "صيغة رقم الهاتف غير صالحة",
    invalidEmail: "صيغة البريد الإلكتروني غير صالحة",
    minPassword: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    passwordLetters: "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل",
    alreadyRegistered: "هذا الحساب مسجل مسبقاً",
    metaLoadError: "تعذر تحميل البيانات. اضغط لإعادة المحاولة",
    networkError: "تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى",

    dropdownPlaceholder: "مثال",

    statusNone: "غير مسجّل",
    statusPending: "قيد المراجعة",
    statusApproved: "مقبول",
    statusActive: "نشط",
    statusRejected: "مرفوض",
    statusRegistered: "مسجّل",

    driverAlreadyRegisteredBanner:
        "أنت مسجّل مسبقاً كرجل توصيل. لا يمكن إرسال طلب جديد.",
    driverPendingBanner: "طلب انضمامك كرجل توصيل قيد المراجعة.",
    driverActiveBanner: "حسابك كرجل توصيل نشط.",
    submitting: "جاري الإرسال...",
    fillRequiredFields: "يرجى تعبئة الحقول المطلوبة",
    scrollToFix: "يرجى تصحيح الحقول المشار إليها باللون الأحمر",
} as const;

/** Backend may return unresolved i18n keys; map them to clear Arabic copy. */
const JOIN_API_ERROR_MESSAGES: Record<string, string> = {
    "messages.validation.password.letters": JOIN_STRINGS.passwordLetters,
};

export function localizeJoinApiMessage(message: string): string {
    return JOIN_API_ERROR_MESSAGES[message.trim()] ?? message;
}

export function localizeJoinFieldErrors(
    fieldErrors: Partial<Record<string, string>>,
): Partial<Record<string, string>> {
    const localized: Record<string, string> = {};
    for (const [field, message] of Object.entries(fieldErrors)) {
        if (message) localized[field] = localizeJoinApiMessage(message);
    }
    return localized;
}

export const JOIN_STATUS_LABEL: Record<
    "none" | "pending" | "approved" | "active" | "rejected" | "registered",
    string
> = {
    none: JOIN_STRINGS.statusNone,
    pending: JOIN_STRINGS.statusPending,
    approved: JOIN_STRINGS.statusApproved,
    active: JOIN_STRINGS.statusActive,
    rejected: JOIN_STRINGS.statusRejected,
    registered: JOIN_STRINGS.statusRegistered,
};

export const JOIN_DROPDOWN_OPTIONS = [
    "مثال 1",
    "مثال 2",
    "مثال 3",
    "مثال 4",
    "مثال 5",
] as const;

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
