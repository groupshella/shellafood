export default function AddressDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-4 pb-8 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex flex-col gap-4">
          {[1, 2].map((j) => (
            <div key={j} className="flex items-center gap-3 py-1">
              <div className="w-8 h-8 rounded-xl bg-gray-200 flex-shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="h-2.5 w-16 bg-gray-100 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
