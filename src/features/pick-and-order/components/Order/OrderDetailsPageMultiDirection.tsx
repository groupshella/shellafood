// src/features/pick-and-order/components/OrderFlow.tsx
"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLoadScript } from "@react-google-maps/api";
import { MapSection, PhoneInput } from "@/shared/components/forms";
import { ServiceStorage, PICK_ORDER_SERVICE_ID } from "@/shared/lib/serviceStorage";
import { FileStore } from "@/features/pick-and-order/lib/fileStore";
import {
  type LocationPoint, type OrderFormData, type ValidationErrors, type OrderStep,
  makePoint, makeForm, validate, calcCompletion, uid,
} from "../../types/Order.types";

// ─── Icons (unchanged from original) ─────────────────────────────────────────

const ic = (d: string) => (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IcPin = ic("M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0zM12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0");
const IcPhone = ic("M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z");
const IcUser = ic("M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8");
const IcCamera = ic("M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8");
const IcPlus = ic("M12 5v14M5 12h14");
const IcTrash = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);
const IcChevron = ic("m15 18-6-6 6-6");
const IcCheck = ic("M20 6 9 17l-5-5");
const IcWarn = ic("m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3zM12 9v4M12 17h.01");
const IcSpark = ic("m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z");
const IcX = ic("M18 6 6 18M6 6l12 12");
const IcImg = ic("M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z");
const IcPkg = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </svg>
);
const IcBike = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 0 0-1-1h-1l-4 7h8" /><path d="m7 14 4-7" />
  </svg>
);
const IcTruck = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
    <rect width="7" height="7" x="14" y="10" rx="1" />
    <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);
const IcSpin = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} className={`animate-spin ${p.className ?? ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
const IcArrow = ic("M5 12h14M12 5l7 7-7 7");
const IcRoute = (p: React.SVGProps<SVGSVGElement>) => (
  <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_DROPOFFS = 5;
const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderType = "direct" | "multi_stop";

// ─── Shared style helpers ─────────────────────────────────────────────────────

const inputCls = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-xl text-sm text-right bg-white border-2 transition-all duration-200
   focus:outline-none placeholder:text-gray-300 text-gray-800
   ${hasError
    ? "border-red-300 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,.1)]"
    : "border-gray-200 focus:border-green-400 focus:shadow-[0_0_0_3px_rgba(22,163,74,.1)]"}`;

// ─── Step bar ─────────────────────────────────────────────────────────────────

const STEPS = [
  { key: "details", label: "التفاصيل" },
  { key: "summary", label: "المراجعة" },
  { key: "confirmation", label: "تم الإرسال" },
] as const;

function StepBar({ step }: { step: OrderStep }) {
  const activeIdx = STEPS.findIndex(s => s.key === step);
  return (
    <div className="flex items-center justify-center gap-0 mb-8 select-none">
      {STEPS.map((s, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        return (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 ${done ? "bg-green-500 text-white shadow-md shadow-green-200" :
                active ? "bg-gray-900 text-white ring-4 ring-gray-100 shadow-lg" :
                  "bg-gray-100 text-gray-400"
                }`}>
                {done ? <IcCheck className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[11px] font-bold tracking-wide transition-colors ${active ? "text-gray-900" : done ? "text-green-500" : "text-gray-300"
                }`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-10 sm:w-16 h-0.5 mx-2 mb-5 rounded-full transition-all duration-500 ${i < activeIdx ? "bg-green-400" : "bg-gray-100"
                }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order type selector (unchanged) ─────────────────────────────────────────

function OrderTypeSelector({ selected, onSelect, isMotorbike }: {
  selected: OrderType | null;
  onSelect: (t: OrderType) => void;
  isMotorbike: boolean;
}) {
  const options = [
    {
      type: "direct" as OrderType,
      icon: IcArrow,
      title: "طلب مباشر",
      subtitle: "من نقطة إلى نقطة",
      desc: "استلام الشحنة من موقع واحد وتوصيلها إلى موقع واحد",
      example: isMotorbike ? "مثال: إرسال مستندات من مكتبك لعميلك" : "مثال: نقل أثاث من شقة قديمة لشقة جديدة",
      isGreen: true,
    },
    {
      type: "multi_stop" as OrderType,
      icon: IcRoute,
      title: "متعدد المحطات",
      subtitle: `حتى ${MAX_DROPOFFS} وجهات`,
      desc: "استلام الشحنة من موقع واحد وتوصيلها لعدة مواقع في رحلة واحدة",
      example: isMotorbike ? "مثال: توزيع طلبات على عدة عملاء" : "مثال: توصيل بضاعة لعدة فروع",
      isGreen: false,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="text-center mb-6">
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">الخطوة الأولى</p>
        <h2 className="text-xl font-black text-gray-900">ما نوع طلبك؟</h2>
        <p className="text-sm text-gray-500 mt-1">اختر نوع الطلب المناسب لاحتياجك</p>
      </div>
      {options.map(opt => {
        const Icon = opt.icon;
        const isActive = selected === opt.type;
        return (
          <motion.button key={opt.type} onClick={() => onSelect(opt.type)}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className={`w-full text-right p-5 rounded-2xl border-2 transition-all duration-200 ${isActive
              ? opt.isGreen ? "border-green-500 bg-green-50 shadow-lg shadow-green-100"
                : "border-amber-400 bg-amber-50 shadow-lg shadow-amber-100"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${isActive ? (opt.isGreen ? "bg-green-500 text-white" : "bg-amber-400 text-white")
                : "bg-gray-100 text-gray-400"
                }`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-base font-black ${isActive ? (opt.isGreen ? "text-green-900" : "text-amber-900") : "text-gray-800"
                    }`}>{opt.title}</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? (opt.isGreen ? "bg-green-200 text-green-700" : "bg-amber-200 text-amber-700")
                    : "bg-gray-100 text-gray-400"
                    }`}>{opt.subtitle}</span>
                </div>
                <p className={`text-sm mb-1.5 ${isActive ? (opt.isGreen ? "text-green-700" : "text-amber-700") : "text-gray-500"
                  }`}>{opt.desc}</p>
                <p className={`text-xs font-medium ${isActive ? (opt.isGreen ? "text-green-500" : "text-amber-500") : "text-gray-400"
                  }`}>{opt.example}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 flex items-center justify-center transition-all ${isActive ? (opt.isGreen ? "border-green-500 bg-green-500" : "border-amber-400 bg-amber-400")
                : "border-gray-300"
                }`}>
                {isActive && <IcCheck className="w-3 h-3 text-white" />}
              </div>
            </div>
          </motion.button>
        );
      })}
      <AnimatePresence>
        {selected && (
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            onClick={() => onSelect(selected)}
            className={`w-full flex items-center justify-center gap-3 py-4 font-black text-base rounded-2xl transition-all shadow-xl text-white ${selected === "direct"
              ? "bg-green-600 hover:bg-green-700 shadow-green-200"
              : "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
              }`}
          >
            <span>التالي — أدخل تفاصيل الطلب</span>
            <IcChevron className="w-5 h-5 rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Field wrapper (unchanged) ────────────────────────────────────────────────

function Field({ label, required, error, dataErrorKey, children }: {
  label: string; required?: boolean; error?: string; dataErrorKey?: string; children: React.ReactNode;
}) {
  return (
    <div {...(dataErrorKey ? { "data-error-key": dataErrorKey } : {})}>
      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-red-400 mr-1">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-medium">
            <IcWarn className="w-3 h-3 flex-shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Toggle (unchanged) ───────────────────────────────────────────────────────

function Toggle({ on, onChange, label, hint }: {
  on: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-right ${on ? "border-green-300 bg-green-50" : "border-gray-200 bg-white hover:border-gray-300"
        }`}
    >
      <div className="text-right">
        <p className={`text-sm font-bold ${on ? "text-green-800" : "text-gray-700"}`}>{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 mr-3 ${on ? "bg-green-500" : "bg-gray-200"}`}>
        <motion.span animate={{ x: on ? 20 : 2 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow block" />
      </div>
    </button>
  );
}

// ─── Section card (unchanged) ─────────────────────────────────────────────────

const CARD_COLORS = {
  green: { bar: "from-green-500 to-emerald-400", icon: "bg-green-50 text-green-600" },
  amber: { bar: "from-amber-400 to-orange-400", icon: "bg-amber-50 text-amber-600" },
  blue: { bar: "from-blue-400 to-indigo-400", icon: "bg-blue-50 text-blue-600" },
  slate: { bar: "from-slate-400 to-gray-500", icon: "bg-slate-50 text-slate-500" },
} as const;

function SectionCard({ icon: Icon, title, subtitle, color = "green", children }: {
  icon: React.ElementType; title: string; subtitle?: string;
  color?: keyof typeof CARD_COLORS; children: React.ReactNode;
}) {
  const c = CARD_COLORS[color];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-l ${c.bar}`} />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="text-right">
            <p className="text-base font-black text-gray-800">{title}</p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Image upload (fixed: stores File in FileStore) ───────────────────────────

function ImageUpload({ label, value, onChange, multiple = false, icon: Icon = IcCamera, hint, fileStoreKey }: {
  label: string; value: string | string[] | null;
  onChange: (v: string | string[] | null) => void;
  multiple?: boolean; icon?: React.ElementType; hint?: string;
  fileStoreKey: "packageImages" | { stopOrder: number };
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);

    const previewPromises = fileArray.map(
      f => new Promise<string>(res => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(f);
      })
    );

    Promise.all(previewPromises).then(previews => {
      // ✅ Store real File objects in the module-level FileStore
      if (fileStoreKey === "packageImages") {
        const existing = FileStore.getPackageImages();
        FileStore.setPackageImages(multiple ? [...existing, ...fileArray] : [fileArray[0]]);
      } else {
        // stopOrder keyed photo — only one per stop
        FileStore.setStopPhoto(fileStoreKey.stopOrder, fileArray[0]);
      }

      if (multiple) {
        const prev = Array.isArray(value) ? value : [];
        onChange([...prev, ...previews]);
      } else {
        onChange(previews[0]);
      }
    });
  }, [multiple, value, onChange, fileStoreKey]);

  const removeAt = useCallback((idx: number) => {
    if (!multiple || !Array.isArray(value)) return;
    const next = value.filter((_, i) => i !== idx);
    onChange(next.length ? next : null);
    if (fileStoreKey === "packageImages") {
      const existing = FileStore.getPackageImages();
      FileStore.setPackageImages(existing.filter((_, i) => i !== idx));
    }
  }, [multiple, value, onChange, fileStoreKey]);

  const removeStop = useCallback(() => {
    onChange(null);
    if (typeof fileStoreKey === "object") {
      FileStore.setStopPhoto(fileStoreKey.stopOrder, null);
    }
  }, [onChange, fileStoreKey]);

  const images = multiple
    ? (Array.isArray(value) ? value : [])
    : (value ? [value as string] : []);

  return (
    <div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden"
        onChange={e => handleFiles(e.target.files)} />
      {images.length > 0 ? (
        <div className={`grid gap-2 ${multiple ? "grid-cols-3" : "grid-cols-1"}`}>
          {images.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100 border border-gray-200">
              <img src={src} className="w-full h-full object-cover" alt="" />
              <button onClick={() => multiple ? removeAt(i) : removeStop()}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                <IcX className="w-3 h-3 text-white" />
              </button>
            </motion.div>
          ))}
          {multiple && (
            <button onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-green-300 hover:bg-green-50 transition-all">
              <IcPlus className="w-6 h-6 text-gray-400" />
            </button>
          )}
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()}
          className="w-full h-28 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-green-300 hover:bg-green-50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:border-green-200 transition-all">
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          </div>
          <p className="text-xs font-semibold text-gray-400 group-hover:text-green-600 transition-colors">
            {hint ?? "اضغط للرفع"}
          </p>
        </button>
      )}
    </div>
  );
}

// ─── Location card ────────────────────────────────────────────────────────────

function LocationCard({ pt, idx, errors, onUpdate, onRemove, canRemove, isLoaded, loadError, stopOrder }: {
  pt: LocationPoint; idx: number; errors: ValidationErrors;
  onUpdate: (patch: Partial<LocationPoint>) => void; onRemove: () => void; canRemove: boolean;
  isLoaded: boolean; loadError: Error | undefined; stopOrder: number;
}) {
  const isPickup = pt.type === "pickup";
  const pfx = isPickup ? `pu_${idx}` : `do_${idx}`;
  const borderCls = isPickup ? "border-green-100 bg-green-50/20" : "border-orange-100 bg-orange-50/20";
  const headerCls = isPickup ? "border-green-100 bg-green-50" : "border-orange-100 bg-orange-50";
  const accentBg = isPickup ? "bg-green-600" : "bg-orange-500";
  const badgeCls = isPickup
    ? "bg-green-50 text-green-700 border-green-200"
    : "bg-orange-50 text-orange-600 border-orange-200";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      className={`rounded-2xl border-2 ${borderCls} overflow-hidden`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b-2 ${headerCls}`}>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 ${accentBg} rounded-lg flex items-center justify-center text-white text-xs font-black`}>
            {idx + 1}
          </div>
          <span className={`text-xs font-black border px-2.5 py-1 rounded-full ${badgeCls}`}>
            {isPickup ? "نقطة الالتقاط" : "نقطة التوصيل"}
          </span>
        </div>
        {canRemove && (
          <button onClick={onRemove}
            className="w-7 h-7 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg flex items-center justify-center transition-colors">
            <IcTrash className="w-3.5 h-3.5 text-red-500" />
          </button>
        )}
      </div>
      <div className="p-4 space-y-4">
        <MapSection
          title={isPickup ? "حدد موقع الالتقاط" : "حدد موقع التوصيل"}
          location={pt.location ? `${pt.location.lat},${pt.location.lng}` : ""}
          onLocationChange={loc => {
            const [lat, lng] = loc.split(",").map(Number);
            onUpdate({ location: { lat, lng } });
          }}
          loadError={loadError} isLoaded={isLoaded}
          defaultCenter={{ lat: 24.7136, lng: 46.6753 }}
          colorTheme="green"
        />

        <Field label="الشارع" required error={errors[`${pfx}_street`]} dataErrorKey={`${pfx}_street`}>
          <input dir="rtl" value={pt.streetName} placeholder="شارع الملك فهد"
            onChange={e => onUpdate({ streetName: e.target.value })}
            className={inputCls(!!errors[`${pfx}_street`])} />
        </Field>

        <Field label="معلم قريب (للتحديد الدقيق)" required error={errors[`${pfx}_landmark`]} dataErrorKey={`${pfx}_landmark`}>
          <input dir="rtl" value={pt.landmark} placeholder="مثل: بجانب بنك الراجحي، أمام صيدلية النور"
            onChange={e => onUpdate({ landmark: e.target.value })}
            className={inputCls(!!errors[`${pfx}_landmark`])} />
        </Field>

        {isPickup && (
          <>
            <Field label="موعد وصول السائق للالتقاط" required error={errors[`${pfx}_scheduled`]} dataErrorKey={`${pfx}_scheduled`}>
              <input type="datetime-local" dir="ltr" value={pt.scheduledDateTime}
                onChange={e => onUpdate({ scheduledDateTime: e.target.value })}
                className={inputCls(!!errors[`${pfx}_scheduled`])} />
            </Field>
            <Field label="رقم جهة اتصال عند نقطة الالتقاط" required error={errors[`${pfx}_contact`]} dataErrorKey={`${pfx}_contact`}>
              <PhoneInput label="" required isArabic value={pt.contactPhone}
                onChange={v => onUpdate({ contactPhone: v })}
                error={errors[`${pfx}_contact`]} />
            </Field>
          </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label={isPickup ? "المبنى / الدور" : "الدور / الشقة"}
            required={!isPickup} error={!isPickup ? errors[`${pfx}_building`] : undefined}
            dataErrorKey={!isPickup ? `${pfx}_building` : undefined}>
            <input dir="rtl" value={pt.building}
              placeholder={isPickup ? "برج A، ط 3" : "الطابق الثالث، شقة 12"}
              onChange={e => onUpdate({ building: e.target.value })}
              className={inputCls(!isPickup && !!errors[`${pfx}_building`])} />
          </Field>
          <Field label="تفاصيل إضافية">
            <input dir="rtl" value={pt.additionalDetails} placeholder="شقة 12"
              onChange={e => onUpdate({ additionalDetails: e.target.value })}
              className={inputCls()} />
          </Field>
        </div>

        {/* ✅ FileStore-integrated building photo upload */}
        <ImageUpload
          label="صورة المبنى (اختياري)"
          value={pt.buildingPhoto}
          onChange={v => onUpdate({ buildingPhoto: v as string | null })}
          icon={IcCamera}
          hint="صورة المبنى أو البوابة للسائق"
          fileStoreKey={{ stopOrder }}
        />

        {!isPickup && (
          <div className="pt-3 border-t-2 border-dashed border-gray-100 space-y-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">بيانات المستلم</p>
            <Field label="الاسم الكامل" required error={errors[`${pfx}_rname`]} dataErrorKey={`${pfx}_rname`}>
              <div className="relative">
                <IcUser className="absolute top-3.5 right-3.5 w-4 h-4 text-gray-300 pointer-events-none" />
                <input dir="rtl" value={pt.recipientName} placeholder="اسم المستلم"
                  onChange={e => onUpdate({ recipientName: e.target.value })}
                  className={`${inputCls(!!errors[`${pfx}_rname`])} pr-10`} />
              </div>
            </Field>
            <Field label="رقم الجوال" required error={errors[`${pfx}_rphone`]} dataErrorKey={`${pfx}_rphone`}>
              <PhoneInput label="" required isArabic value={pt.recipientPhone}
                onChange={v => onUpdate({ recipientPhone: v })}
                error={errors[`${pfx}_rphone`]} />
            </Field>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

function useOrderFlow(transportType = "motorbike") {
  const router = useRouter();

  const [orderType, setOrderType] = useState<OrderType | null>(() => {
    // ✅ Restore order type from storage on mount (fixes back-navigation reset)
    try {
      const stored = ServiceStorage.loadBookingData(PICK_ORDER_SERVICE_ID);
      return (stored?.orderType as OrderType) ?? null;
    } catch { return null; }
  });

  const [form, setForm] = useState<OrderFormData>(() => {
    // ✅ Restore form from storage on mount (fixes back-navigation data loss)
    try {
      const stored = ServiceStorage.loadBookingData(PICK_ORDER_SERVICE_ID);
      if (stored?.form) return stored.form as OrderFormData;
    } catch { /* ignore */ }
    return makeForm(transportType);
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const step: OrderStep = "details";
  const pct = useMemo(() => calcCompletion(form), [form]);

  // ✅ Persist form + orderType to storage on every change (debounced 300ms)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!orderType) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      ServiceStorage.saveBookingData(PICK_ORDER_SERVICE_ID, { form, orderType });
    }, 300);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [form, orderType]);

  const selectOrderType = useCallback((type: OrderType) => {
    // Only reset form if switching to a different type
    setOrderType(prev => {
      if (prev !== type) {
        setForm(makeForm(transportType));
        FileStore.clear();
      }
      return type;
    });
    setErrors({});
  }, [transportType]);

  const updateField = useCallback(<K extends keyof OrderFormData>(key: K, value: OrderFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const updatePoint = useCallback((id: string, patch: Partial<LocationPoint>) => {
    setForm(prev => ({
      ...prev,
      locationPoints: prev.locationPoints.map(p => p.id === id ? { ...p, ...patch } : p),
    }));
  }, []);

  const addDropoff = useCallback(() => {
    setForm(prev => {
      const count = prev.locationPoints.filter(p => p.type === "dropoff").length;
      if (count >= MAX_DROPOFFS) return prev;
      return { ...prev, locationPoints: [...prev.locationPoints, makePoint("dropoff", count)] };
    });
  }, []);

  const removePoint = useCallback((id: string) => {
    setForm(prev => ({
      ...prev,
      locationPoints: prev.locationPoints.filter(p => p.id !== id),
    }));
  }, []);

  const goToSummary = useCallback(() => {
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      setTimeout(() => {
        document.querySelector(`[data-error-key="${firstKey}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
      return;
    }
    // ✅ Save form + orderType before navigating (files are already in FileStore)
    ServiceStorage.saveBookingData(PICK_ORDER_SERVICE_ID, { form, orderType });
    router.push(`/pickandorder/${transportType}/order/summary?orderType=${orderType}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [form, transportType, orderType, router]);

  return {
    orderType, selectOrderType,
    step, form, errors, pct,
    updateField, updatePoint, addDropoff, removePoint,
    goToSummary,
  };
}

// ─── Details step ─────────────────────────────────────────────────────────────

function DetailsStep({ orderType, form, errors, pct, updateField, updatePoint, addDropoff, removePoint, goToSummary }: {
  orderType: OrderType; form: OrderFormData; errors: ValidationErrors; pct: number;
  updateField: <K extends keyof OrderFormData>(k: K, v: OrderFormData[K]) => void;
  updatePoint: (id: string, patch: Partial<LocationPoint>) => void;
  addDropoff: () => void; removePoint: (id: string) => void;
  goToSummary: () => void;
}) {
  const pickup = form.locationPoints.find(p => p.type === "pickup")!;
  const dropoffs = form.locationPoints.filter(p => p.type === "dropoff");
  const isMotorbike = form.transportType === "motorbike";
  const isMultiStop = orderType === "multi_stop";
  const hasErrors = Object.keys(errors).length > 0;
  const canAddMore = dropoffs.length < MAX_DROPOFFS;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  return (
    <motion.div key="details" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-5">

      {/* Order type reminder */}
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isMultiStop ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"
        }`}>
        {isMultiStop
          ? <IcRoute className="w-4 h-4 text-amber-500 shrink-0" />
          : <IcArrow className="w-4 h-4 text-green-600 shrink-0" />
        }
        <p className={`text-sm font-bold ${isMultiStop ? "text-amber-700" : "text-green-700"}`}>
          {isMultiStop ? `طلب متعدد المحطات — حتى ${MAX_DROPOFFS} وجهات توصيل` : "طلب مباشر — وجهة توصيل واحدة"}
        </p>
      </div>

      {/* Validation banner */}
      <AnimatePresence>
        {hasErrors && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
            <IcWarn className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <div className="flex-1 text-right">
              <p className="text-sm font-bold text-amber-800">يرجى إكمال الحقول المطلوبة</p>
              <div className="mt-2 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-amber-400 rounded-full" animate={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-amber-600 mt-1">{pct}% مكتمل</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pickup */}
      <SectionCard icon={IcPin} title="موقع الالتقاط" subtitle="نقطة استلام الشحنة" color="green">
        <LocationCard pt={pickup} idx={0} errors={errors}
          isLoaded={isLoaded} loadError={loadError}
          onUpdate={patch => updatePoint(pickup.id, patch)}
          onRemove={() => { }} canRemove={false} stopOrder={1} />
      </SectionCard>

      {/* Dropoffs */}
      <SectionCard
        icon={IcPin}
        title={isMultiStop ? "مواقع التوصيل" : "موقع التوصيل"}
        subtitle={isMultiStop ? `${dropoffs.length} من ${MAX_DROPOFFS} وجهات` : "الوجهة الواحدة"}
        color="amber">
        <div className="space-y-4">
          <AnimatePresence>
            {dropoffs.map((pt, i) => (
              <LocationCard key={pt.id} pt={pt} idx={i} errors={errors}
                isLoaded={isLoaded} loadError={loadError}
                onUpdate={patch => updatePoint(pt.id, patch)}
                onRemove={() => removePoint(pt.id)}
                canRemove={isMultiStop && dropoffs.length > 1}
                stopOrder={i + 2} />
            ))}
          </AnimatePresence>
          {isMultiStop && (
            <AnimatePresence>
              {canAddMore ? (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={addDropoff}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-orange-200 text-orange-500 text-sm font-bold hover:border-orange-400 hover:bg-orange-50 transition-all">
                  <IcPlus className="w-4 h-4" />
                  إضافة وجهة توصيل
                  <span className="text-xs text-orange-400">({dropoffs.length}/{MAX_DROPOFFS})</span>
                </motion.button>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-3 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-xs text-gray-400 font-medium">وصلت للحد الأقصى ({MAX_DROPOFFS} وجهات توصيل)</p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </SectionCard>

      {/* Package details — NO pricing rows */}
      <SectionCard icon={IcPkg} title="تفاصيل الشحنة" color="blue">
        <div className="space-y-4">
          <Field label="نوع الشحنة / التصنيف" required error={errors.shipmentCategory} dataErrorKey="shipmentCategory">
            <select dir="rtl" value={form.shipmentCategory}
              onChange={e => updateField("shipmentCategory", e.target.value)}
              className={inputCls(!!errors.shipmentCategory)}>
              <option value="">اختر نوع الشحنة</option>
              <option value="furniture">أثاث</option>
              <option value="electronics">إلكترونيات</option>
              <option value="food">مواد غذائية</option>
              <option value="construction">مواد بناء</option>
              <option value="documents">مستندات</option>
              <option value="clothing">ملابس</option>
              <option value="other">أخرى</option>
            </select>
          </Field>
          <Field label="عدد القطع / الصناديق" required error={errors.numberOfPieces} dataErrorKey="numberOfPieces">
            <input type="number" min={1} dir="ltr" value={form.numberOfPieces} placeholder="مثال: 2"
              onChange={e => updateField("numberOfPieces", e.target.value)}
              className={`${inputCls(!!errors.numberOfPieces)} text-left`} />
          </Field>
          <Field label="قيمة الشحنة (ريال) — اختياري للتأمين">
            <input type="number" min={0} dir="ltr" value={form.shipmentValue} placeholder="للأمانة والتأمين"
              onChange={e => updateField("shipmentValue", e.target.value)}
              className={`${inputCls()} text-left`} />
          </Field>
          <Field label="وصف الشحنة" required error={errors.desc} dataErrorKey="desc">
            <textarea dir="rtl" rows={3} value={form.packageDescription}
              placeholder="صف محتويات شحنتك بوضوح حتى يفهم السائق ما يحمله..."
              onChange={e => updateField("packageDescription", e.target.value)}
              className={`${inputCls(!!errors.desc)} resize-none`} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="الوزن (كجم)" required error={errors.weight} dataErrorKey="weight">
              <input type="number" dir="ltr" value={form.packageWeight} placeholder="0.0"
                onChange={e => updateField("packageWeight", e.target.value)}
                className={`${inputCls(!!errors.weight)} text-left`} />
            </Field>
            <Field label="الأبعاد (سم)">
              <input dir="ltr" value={form.packageDimensions} placeholder="30×20×15"
                onChange={e => updateField("packageDimensions", e.target.value)}
                className={`${inputCls()} text-left`} />
            </Field>
          </div>
          <Field label="ملاحظات للسائق">
            <textarea dir="rtl" rows={2} value={form.specialInstructions} placeholder="أي تعليمات خاصة..."
              onChange={e => updateField("specialInstructions", e.target.value)}
              className={`${inputCls()} resize-none`} />
          </Field>
          {/* ✅ FileStore-integrated package image upload */}
          <ImageUpload
            label="صور الشحنة (اختياري)"
            value={form.packageImages}
            onChange={v => updateField("packageImages", (v as string[]) ?? [])}
            multiple icon={IcImg}
            hint="أضف صور لتوثيق حالة الشحنة"
            fileStoreKey="packageImages"
          />
        </div>
      </SectionCard>

      {/* Extra options — no pricing hints */}
      <SectionCard icon={IcSpark} title="خيارات إضافية" color="slate">
        <div className="space-y-2.5">
          <Toggle on={form.isFragile} onChange={v => updateField("isFragile", v)}
            label="⚠️ شحنة قابلة للكسر" hint="سيتم التعامل مع الشحنة بحذر شديد" />
          <Toggle on={form.isExpress} onChange={v => updateField("isExpress", v)}
            label="⚡ توصيل سريع" />
          {!isMotorbike && (
            <>
              <Toggle on={form.requiresRefrigeration} onChange={v => updateField("requiresRefrigeration", v)}
                label="🧊 يتطلب تبريد" />
              <Toggle on={form.loadingEquipmentNeeded} onChange={v => updateField("loadingEquipmentNeeded", v)}
                label="🏗️ معدات تحميل" />
            </>
          )}
          {isMotorbike && (
            <Toggle on={form.isDocuments} onChange={v => updateField("isDocuments", v)}
              label="📄 مستندات مهمة" hint="سيتم الحفاظ على المستندات بعناية" />
          )}
        </div>
      </SectionCard>

      {/* Submit */}
      <button onClick={goToSummary}
        className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 hover:bg-gray-800 text-white font-black text-base rounded-2xl transition-all duration-200 shadow-xl shadow-gray-200">
        <span>مراجعة الطلب قبل الإرسال</span>
        <IcChevron className="w-5 h-5 rotate-180" />
      </button>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OrderFlow({ transportType = "motorbike" }: { transportType?: string }) {
  const {
    orderType, selectOrderType,
    step, form, errors, pct,
    updateField, updatePoint, addDropoff, removePoint,
    goToSummary,
  } = useOrderFlow(transportType);

  const isMotorbike = form.transportType === "motorbike";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/80" style={{ fontFamily: "'Tajawal','Cairo','Segoe UI',sans-serif" }}>
      {/* Sticky nav */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-900">
              {isMotorbike
                ? <IcBike className="w-5 h-5 text-green-400" />
                : <IcTruck className="w-5 h-5 text-green-400" />
              }
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">{isMotorbike ? "دراجة نارية" : "شاحنة"}</p>
              <p className="text-sm font-black text-gray-900">
                {!orderType ? "اختر نوع الطلب"
                  : orderType === "direct" ? "طلب مباشر" : "متعدد المحطات"}
              </p>
            </div>
          </div>
          {orderType && pct > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-green-500 rounded-full" animate={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-black text-gray-500">{pct}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 pb-28">
        {orderType && <StepBar step={step} />}
        <AnimatePresence mode="wait">
          {!orderType && (
            <motion.div key="type-select" exit={{ opacity: 0, x: -20 }}>
              <OrderTypeSelector selected={orderType} onSelect={selectOrderType} isMotorbike={isMotorbike} />
            </motion.div>
          )}
          {orderType && step === "details" && (
            <DetailsStep
              key="details"
              orderType={orderType} form={form} errors={errors} pct={pct}
              updateField={updateField} updatePoint={updatePoint}
              addDropoff={addDropoff} removePoint={removePoint}
              goToSummary={goToSummary}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}