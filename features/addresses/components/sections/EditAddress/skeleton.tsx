export default function EditAddressSkeleton() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-8 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 flex flex-col gap-4">
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-11 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ))}
      <div className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100">
        <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
        <div className="h-20 bg-gray-100 rounded-xl" />
      </div>
      <div className="h-14 bg-gray-200 rounded-2xl mt-2" />
    </div>
  );
}
