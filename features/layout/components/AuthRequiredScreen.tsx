import Image from "next/image";
import Link from "next/link";

export type AuthRequiredPage = "cart" | "favorites" | "orders" | "notifications" | "checkout";

const PAGE_TITLES: Record<AuthRequiredPage, { ar: string; en: string }> = {
	cart: { ar: "السلة", en: "Cart" },
	favorites: { ar: "مفضلاتي", en: "Favorites" },
	orders: { ar: "طلباتي", en: "Orders" },
	notifications: { ar: "الإشعارات", en: "Notifications" },
	checkout: { ar: "الدفع", en: "Checkout" },
};

interface AuthRequiredScreenProps {
	page: AuthRequiredPage;
	isArabic: boolean;
}

export function AuthRequiredScreen({ page, isArabic }: AuthRequiredScreenProps) {
	return (
		<div
			className="mx-auto flex min-h-dvh w-full max-w-lg flex-col overflow-x-hidden bg-background pb-[calc(58px+env(safe-area-inset-bottom))] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
			dir={isArabic ? "rtl" : "ltr"}
			lang={isArabic ? "ar" : "en"}
		>
			<header className="flex items-center justify-center px-3 py-3 sm:px-4 sm:py-3.5 md:px-5 lg:px-6">
				<h1 className="text-base font-semibold text-foreground sm:text-lg lg:text-xl">
					{isArabic ? PAGE_TITLES[page].ar : PAGE_TITLES[page].en}
				</h1>
			</header>

			<div className="flex flex-1 flex-col items-center px-4 text-center sm:px-6 md:px-8">
				<div className="mx-auto mt-12 flex w-full max-w-xs flex-col items-center sm:mt-20 sm:max-w-sm md:mt-24 md:max-w-md lg:mt-28">
					<div className="relative aspect-[242/231] w-full max-w-[13rem] shrink-0 sm:max-w-[15rem] md:max-w-[16rem] lg:max-w-[18rem]">
						<Image
							src="/layout/auth-required.png"
							alt=""
							fill
							className="object-contain"
							sizes="(min-width: 1024px) 288px, (min-width: 768px) 256px, (min-width: 640px) 240px, 208px"
							priority
						/>
					</div>

					<h2 className="mt-5 text-lg font-bold text-foreground sm:mt-6 sm:text-xl md:text-2xl">
						{isArabic ? "يجب تسجيل دخول أولاً" : "Sign in required"}
					</h2>

					<p className="mt-2 max-w-[260px] text-sm leading-relaxed text-muted sm:max-w-sm sm:text-[15px] md:max-w-md">
						{isArabic
							? "الرجاء تسجيل الدخول للمتابعة"
							: "Please sign in to continue"}
					</p>

					<Link
						href="/auth"
						className={[
							"mt-6 flex min-h-12 w-full items-center justify-center rounded-xl sm:mt-8 md:min-h-14",
							"bg-brand px-4 text-base font-bold text-brand-foreground",
							"transition-colors hover:brightness-95 active:brightness-90",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						].join(" ")}
					>
						{isArabic ? "تسجيل دخول" : "Sign in"}
					</Link>
				</div>
			</div>
		</div>
	);
}
