export default function AddressListSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-24 bg-gray-200 rounded-md" />
            <div className="h-3 w-48 bg-gray-100 rounded-md" />
          </div>
        </div>
      ))}
      <div className="h-14 w-full bg-gray-200 rounded-2xl mt-2" />
    </div>
  );
}
