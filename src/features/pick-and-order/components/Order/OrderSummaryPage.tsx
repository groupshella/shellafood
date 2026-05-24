"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight, Send, Loader2, MapPin, Package,
  Bike, Truck, AlertCircle,
} from "lucide-react";
import { ServiceStorage, PICK_ORDER_SERVICE_ID } from "@/shared/lib/serviceStorage";
import { FileStore } from "@/features/pick-and-order/lib/fileStore";
import { type OrderFormData, SHIPMENT_LABELS } from "../../types/Order.types";
import { useTransportOrder } from "../../hooks/UseTransportOrder";
import { NotificationDialog } from "@/shared/components/NotificationDialog/NotificationDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredBooking {
  form: OrderFormData;
  orderType: string;
}

interface Props {
  transportType: string;
  orderType?: string;
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">جاري التحميل...</p>
      </div>
    </div>
  );
}

function EmptyScreen({ onEdit }: { onEdit: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
      <div className="text-center max-w-md">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">لم يتم العثور على البيانات</h2>
        <p className="text-gray-600 mb-6">يرجى إكمال تفاصيل الطلب أولاً</p>
        <button onClick={onEdit}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors">
          إكمال التفاصيل
        </button>
      </div>
    </div>
  );
}

function SRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0 ${bold ? "font-black" : ""}`}>
      <span className="text-sm text-gray-500 text-right">{label}</span>
      <span className="text-sm font-semibold text-right text-gray-800">{value}</span>
    </div>
  );
}

function SectionCard({ colorBar, icon: Icon, iconCls, title, children }: {
  colorBar: string; icon: React.ElementType; iconCls: string; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`h-1.5 bg-gradient-to-l ${colorBar}`} />
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCls}`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-base font-black text-gray-800">{title}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OrderSummaryPage({ transportType, orderType }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderTypeParam = searchParams.get("orderType") ?? orderType ?? "";

  const [booking, setBooking] = useState<StoredBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [showIncompleteNotification, setShowIncompleteNotification] = useState(false);

  const isMotorbike = transportType === "motorbike";
  const { submitting: apiSubmitting, error: apiError, submitOrder: submitToApi, reset: resetApiError } = useTransportOrder();

  // Show error dialog when API sets an error
  useEffect(() => {
    if (apiError) setShowErrorNotification(true);
  }, [apiError]);

  // ── Load booking from storage ──────────────────────────────────────────────

  useEffect(() => {
    const stored = ServiceStorage.loadBookingData(PICK_ORDER_SERVICE_ID);
    if (!stored?.form) {
      setLoading(false);
      return;
    }
    setBooking({
      form: stored.form as OrderFormData,
      orderType: (stored.orderType as string) ?? orderTypeParam,
    });
    setLoading(false);
  }, [orderTypeParam]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleEdit = useCallback(() => {
    // ✅ Navigate back WITHOUT clearing storage — form will be restored
    router.push(`/pickandorder/${transportType}/order/details`);
  }, [router, transportType]);

  const handleSubmit = useCallback(async () => {
    if (!booking) return;

    const result = await submitToApi(
      booking.form,
      booking.orderType,
      FileStore.getStopPhotos(),
      FileStore.getPackageImages()
    );

    if (!result?.succeeded) return;

    const orderId = result.data?.orderNumber ?? `ORD-${Date.now().toString().slice(-8)}`;

    ServiceStorage.saveConfirmationData(PICK_ORDER_SERVICE_ID, {
      orderId,
      form: booking.form,
      orderType: booking.orderType,
    });
    ServiceStorage.clearBookingData(PICK_ORDER_SERVICE_ID);
    FileStore.clear();

    router.push(`/pickandorder/${transportType}/order/confirm?orderType=${booking.orderType}`);
  }, [booking, submitToApi, transportType, router]);

  // ── Guard renders ──────────────────────────────────────────────────────────

  if (loading) return <LoadingScreen />;
  if (!booking) return <EmptyScreen onEdit={handleEdit} />;

  const { form } = booking;
  const pickups = form.locationPoints.filter(pt => pt.type === "pickup");
  const dropoffs = form.locationPoints.filter(pt => pt.type === "dropoff");

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/80 py-4" style={{ fontFamily: "'Tajawal','Cairo','Segoe UI',sans-serif" }}>
      <div className="max-w-lg mx-auto px-4 space-y-5">

        {/* Info banner */}
        <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
          <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
          <p className="text-sm text-blue-700 font-semibold text-right">
            راجع تفاصيل طلبك جيداً قبل الإرسال — لن يتم الدفع الآن، ستصلك عروض من السائقين
          </p>
        </div>

        {/* Transport type header */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
            {isMotorbike
              ? <Bike className="w-7 h-7 text-green-600" />
              : <Truck className="w-7 h-7 text-green-600" />
            }
          </div>
          <div className="text-right flex-1">
            <p className="text-base font-black text-gray-900">{isMotorbike ? "دراجة نارية" : "شاحنة"}</p>
            <p className="text-xs text-gray-400">وسيلة الشحن المختارة</p>
          </div>
          <button onClick={handleEdit}
            className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors">
            تعديل
          </button>
        </div>

        {/* Locations */}
        <SectionCard colorBar="from-green-500 to-emerald-400" icon={MapPin} iconCls="bg-green-50 text-green-600" title="المواقع والعناوين">
          <div className="space-y-4">
            {pickups.map((pt, i) => (
              <div key={pt.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-wider mb-1">📍 التقاط</p>
                  <p className="text-sm font-bold text-gray-800">
                    {[pt.streetName, pt.areaName, pt.city].filter(Boolean).join("، ")}
                  </p>
                  {pt.landmark && <p className="text-xs text-green-600 mt-0.5">معلم: {pt.landmark}</p>}
                  {pt.scheduledDateTime && <p className="text-xs text-gray-500 mt-0.5">موعد الوصول: {new Date(pt.scheduledDateTime).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}</p>}
                  {pt.contactPhone && <p className="text-xs text-gray-500 font-mono" dir="ltr">اتصال: {pt.contactPhone}</p>}
                  {pt.building && <p className="text-xs text-gray-400 mt-0.5">{pt.building}</p>}
                  {pt.location && <p className="text-[10px] text-green-500 mt-1">✓ تم تحديد الموقع على الخريطة</p>}
                  {pt.buildingPhoto && (
                    <div className="mt-2 w-20 h-16 rounded-lg overflow-hidden border border-green-100">
                      <img src={pt.buildingPhoto} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="border-t-2 border-dashed border-gray-100 my-1" />

            {dropoffs.map((pt, i) => (
              <div key={pt.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-1">🏁 توصيل</p>
                  <p className="text-sm font-bold text-gray-800">
                    {[pt.streetName, pt.areaName, pt.city].filter(Boolean).join("، ")}
                  </p>
                  {pt.landmark && <p className="text-xs text-orange-600 mt-0.5">معلم: {pt.landmark}</p>}
                  {pt.building && <p className="text-xs text-gray-400 mt-0.5">{pt.building}</p>}
                  {pt.location && <p className="text-[10px] text-orange-400 mt-1">✓ تم تحديد الموقع على الخريطة</p>}
                  {pt.recipientName && (
                    <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 justify-start">
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-700">{pt.recipientName}</p>
                        <p className="text-xs text-gray-400 font-mono" dir="ltr">{pt.recipientPhone}</p>
                      </div>
                    </div>
                  )}
                  {pt.buildingPhoto && (
                    <div className="mt-2 w-20 h-16 rounded-lg overflow-hidden border border-orange-100">
                      <img src={pt.buildingPhoto} className="w-full h-full object-cover" alt="" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Shipment — no pricing */}
        <SectionCard colorBar="from-blue-400 to-indigo-400" icon={Package} iconCls="bg-blue-50 text-blue-600" title="الشحنة">
          <div className="space-y-1">
            {form.shipmentCategory && <SRow label="نوع الشحنة" value={SHIPMENT_LABELS[form.shipmentCategory] ?? form.shipmentCategory} />}
            {form.numberOfPieces && <SRow label="عدد القطع/الصناديق" value={form.numberOfPieces} />}
            {form.shipmentValue && <SRow label="قيمة الشحنة (للتأمين)" value={`${form.shipmentValue} ريال`} />}
            {form.packageDescription && <SRow label="الوصف" value={form.packageDescription} />}
            {form.packageWeight && <SRow label="الوزن" value={`${form.packageWeight} كجم`} />}
            {form.packageDimensions && <SRow label="الأبعاد" value={`${form.packageDimensions} سم`} />}
            {form.isFragile && <SRow label="تنبيه" value="⚠️ قابل للكسر" />}
            {form.isExpress && <SRow label="التوصيل" value="⚡ سريع" />}
            {form.requiresRefrigeration && <SRow label="خيارات" value="🧊 يتطلب تبريد" />}
            {form.loadingEquipmentNeeded && <SRow label="خيارات" value="🏗️ معدات تحميل" />}
            {form.isDocuments && <SRow label="نوع الطرد" value="📄 مستندات" />}
            {form.specialInstructions && <SRow label="ملاحظات" value={form.specialInstructions} />}
          </div>
          {form.packageImages.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {form.packageImages.map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100">
                  <img src={src} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* API error: shown via NotificationDialog below */}

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={handleEdit}
            className="flex items-center justify-center gap-2 px-5 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold text-sm rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all">
            <ChevronRight className="w-4 h-4 rotate-180" /> تعديل
          </button>
          <button onClick={handleSubmit} disabled={apiSubmitting}
            className="flex-1 flex items-center justify-center gap-3 py-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-black text-base rounded-2xl transition-all duration-200 shadow-xl shadow-green-200 disabled:opacity-60 disabled:cursor-not-allowed">
            {apiSubmitting
              ? <Loader2 className="w-5 h-5 animate-spin" />
              : <><span>إرسال الطلب</span><Send className="w-5 h-5" /></>
            }
          </button>
        </div>
      </div>

      {/* Error notification (API failure) */}
      {apiError && (
        <NotificationDialog
          message={apiError}
          type="error"
          isVisible={showErrorNotification}
          onClose={() => {
            setShowErrorNotification(false);
            resetApiError();
          }}
        />
      )}

      {/* Incomplete form notification */}
      <NotificationDialog
        message="يرجى إكمال الطلب أولاً. تأكد من ملء جميع الحقول المطلوبة."
        type="info"
        isVisible={showIncompleteNotification}
        onClose={() => setShowIncompleteNotification(false)}
      />
    </div>
  );
}