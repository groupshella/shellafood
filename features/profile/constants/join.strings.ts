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

    dropdownPlaceholder: "مثال",
} as const;

export const JOIN_DROPDOWN_OPTIONS = [
    "مثال 1",
    "مثال 2",
    "مثال 3",
    "مثال 4",
    "مثال 5",
] as const;

export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
