// features/payment/components/sections/MyFatoorahPayment/skeleton.tsx
export default function MyFatoorahPaymentSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="h-20 rounded-xl bg-gray-200" />
            <div className="h-40 rounded-xl bg-gray-200" />
            <div className="h-12 rounded-xl bg-gray-200" />
        </div>
    );
}
