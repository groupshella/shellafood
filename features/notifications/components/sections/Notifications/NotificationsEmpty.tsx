export function NotificationsEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            {/* Illustration */}
            <div className="mb-8">
                <img
                    src="/notifications/notifications-empty.png"
                    alt="No notifications"
                    className="w-[240px] h-auto"
                />
            </div>

            {/* Text */}
            <div className="text-center space-y-1">
                <h3 className="text-[18px] font-bold text-[#1F2937] leading-[1.6]">
                    لا يوجد لديك إشعارات
                </h3>

                <p className="text-[16px] font-semibold text-[#374151] leading-[1.6]">
                    في الوقت الحالي
                </p>
            </div>
        </div>
    );
}