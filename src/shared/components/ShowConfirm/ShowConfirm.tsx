// src/shared/components/ShowConfirm/ShowConfirm.tsx
export default function ShowConfirm({ 
  handleClose, 
  handleLogout,
  isLoading = false 
}: { 
  handleClose: () => void;
  handleLogout: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          تأكيد تسجيل الخروج
        </h2>
        <p className="text-gray-600 mb-6">
          هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري الخروج...' : 'تسجيل الخروج'}
          </button>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}