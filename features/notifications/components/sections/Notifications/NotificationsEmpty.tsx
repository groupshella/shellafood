import Image from "next/image";

type NotificationsEmptyProps = {
	isArabic: boolean;
};

export function NotificationsEmpty({ isArabic }: NotificationsEmptyProps) {
	return (
		<div
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
			className="flex min-h-[calc(100dvh-8.5rem)] flex-col items-center justify-center px-4 text-center sm:min-h-[calc(100dvh-9.5rem)] sm:px-6 md:px-8"
		>
			<div className="relative mb-6 aspect-square w-full max-w-[12rem] sm:mb-8 sm:max-w-[14rem] md:max-w-[16rem] lg:max-w-[18rem]">
				<Image
					src="/notifications/notifications-empty.png"
					alt={isArabic ? "لا يوجد إشعارات" : "No notifications"}
					fill
					className="object-contain"
					sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 288px"
					priority
				/>
			</div>

			<div className="space-y-1.5">
				<h2 className="text-lg font-bold text-foreground sm:text-xl md:text-[22px]">
					{isArabic ? "لا يوجد لديك إشعارات" : "You have no notifications"}
				</h2>
				<h2 className="text-lg font-bold text-foreground sm:text-xl">
					{isArabic ? "في الوقت الحالي" : "at the moment"}
				</h2>
			</div>
		</div>
	);
}
