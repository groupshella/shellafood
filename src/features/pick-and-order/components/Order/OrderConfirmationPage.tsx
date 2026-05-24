"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { ServiceStorage, PICK_ORDER_SERVICE_ID } from "@/shared/lib/serviceStorage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocationPoint {
  id: string;
  type: "pickup" | "dropoff";
  streetName: string;
  areaName: string;
  city: string;
  [key: string]: unknown;
}

interface MultiDirConfirmation {
  orderId: string;
  form: {
    transportType: string;
    locationPoints: LocationPoint[];
    [key: string]: unknown;
  };
  pricing: { total: number };
  orderType: string;
}

interface Props {
  transportType: string;
  orderType?: string;
}

// ─── Confirmation view (single, focused) ──────────────────────────────────────

function ConfirmationView({
  data,
  onViewOrders,
  onBackHome,
}: {
  data: MultiDirConfirmation;
  onViewOrders: () => void;
  onBackHome: () => void;
}) {
  const { orderId, form, pricing } = data;
  const isMotorbike = form.transportType === "motorbike";
  const vehicleLabel = isMotorbike ? "دراجة نارية" : "شاحنة";
  const dateStr = new Date().toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4"
      dir="rtl"
      style={{ fontFamily: "'Tajawal', 'Cairo', 'Segoe UI', sans-serif" }}
    >
      <div className="w-full max-w-md">

        {/* Success icon + message */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-5"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600" strokeWidth={2} />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            تم إرسال طلبك بنجاح
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs mx-auto">
            سنراجع الطلب وسيصلك عروض من السائقين قريباً. يمكنك متابعة الطلب من صفحة طلباتي.
          </p>
        </div>

        {/* Key data card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6"
        >
          <div className="px-5 py-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">رقم الطلب</span>
              <span className="font-mono font-semibold text-gray-900 text-lg" dir="ltr">
                {orderId}
              </span>
            </div>
            <div className="border-t border-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">وسيلة النقل</span>
              <span className="font-semibold text-gray-900">{vehicleLabel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">التاريخ</span>
              <span className="font-semibold text-gray-900">{dateStr}</span>
            </div>

          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <button
            type="button"
            onClick={onViewOrders}
            className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-green-200/50"
          >
            <Package className="w-5 h-5" />
            عرض طلباتي
          </button>
          <button
            type="button"
            onClick={onBackHome}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            العودة للرئيسية
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Empty / no data ───────────────────────────────────────────────────────────

function NoDataView({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center"
      dir="rtl"
    >
      <p className="text-gray-600 mb-6">لا توجد بيانات طلب</p>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        العودة لجلب وتوصيل
      </button>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function OrderConfirmationPage({ transportType, orderType }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderTypeParam = searchParams.get("orderType") ?? orderType ?? "";
  const isMultiDirectionFlow =

    orderTypeParam === "direct";

  const [data, setData] = useState<MultiDirConfirmation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isMultiDirectionFlow) {
      setLoading(false);
      return;
    }
    const stored = ServiceStorage.loadConfirmationData(PICK_ORDER_SERVICE_ID);
    if (stored?.orderId && stored.form && stored.orderType) {
      setData(stored as MultiDirConfirmation);
    }
    setLoading(false);
  }, [isMultiDirectionFlow]);

  const handleViewOrders = useCallback(() => {
    router.push("/my-orders");
  }, [router]);

  const handleBackHome = useCallback(() => {
    ServiceStorage.clearAllServiceData(PICK_ORDER_SERVICE_ID);
    router.push("/pickandorder");
  }, [router]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <NoDataView onBack={handleBackHome} />;
  }

  return (
    <ConfirmationView
      data={data}
      onViewOrders={handleViewOrders}
      onBackHome={handleBackHome}
    />
  );
}
