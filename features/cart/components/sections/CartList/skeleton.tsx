export default function CartListSkeleton() {
  return (
    <div className="animate-pulse px-4 pb-36 pt-3" dir="rtl">
      <div className="mb-3 h-4 w-24 rounded-md bg-gray-200" />

      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
          >
            <div className="h-20 w-20 shrink-0 rounded-xl bg-gray-200" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-4 w-32 rounded-md bg-gray-200" />
              <div className="h-3 w-full rounded-md bg-gray-100" />
              <div className="mt-auto flex items-center justify-between">
                <div className="h-4 w-16 rounded-md bg-gray-200" />
                <div className="h-8 w-24 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-gray-100 bg-white px-4 pb-6 pt-3">
        <div className="mb-3 h-12 rounded-2xl bg-gray-100" />
        <div className="h-14 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}
