"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Image from "@/shared/components/SecureImage";
import { useRouter } from "next/navigation";
import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { SupportInfoCard } from "@/features/profile/components/shared/support/SupportInfoCard";

const iconClass = "h-6 w-6 text-muted";

export function HelpSupportClient({ isArabic }: { isArabic: boolean }) {
	const router = useRouter();

	return (
		<ProfileSubpageShell
			title={
				isArabic ? "المساعدة والدعم الفني" : "Help & technical support"
			}
			isArabic={isArabic}
			showHeaderBorder={false}
			relaxedHeader
			mainClassName="px-0"
		>
			<div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 px-4 sm:max-w-2xl sm:gap-10 sm:px-5 md:max-w-3xl md:gap-12 lg:max-w-4xl lg:px-6 xl:max-w-5xl">
				<Image
					src="/favicon.ico"
					alt={isArabic ? "شعار شلة فود" : "Shella Food logo"}
					width={165}
					height={118}
					className="h-auto w-[140px] object-contain sm:w-[165px] md:w-[190px] lg:w-[210px]"
					priority
				/>

				<div className="grid w-full grid-cols-1 gap-3 rounded-2xl bg-card p-3 sm:gap-4 sm:p-4 md:grid-cols-2 md:p-5 lg:gap-5">
					<SupportInfoCard
						icon={<MessageCircle className={iconClass} strokeWidth={1.5} />}
						title={isArabic ? "الدردشة الحية" : "Live chat"}
						body={isArabic ? "المساعدة والدعم" : "Help and support"}
						showChevron
						align="center"
						isArabic={isArabic}
						onClick={() => router.push("/profile/live-chat")}
					/>

					<SupportInfoCard
						icon={<MapPin className={iconClass} strokeWidth={1.5} />}
						title={isArabic ? "عنوان" : "Address"}
						body={
							<p className="whitespace-normal leading-[160%]">
								{isArabic
									? "7426,RIUG7426 ، حي العريجاء الغربي ، أبي خشب"
									: "7426, RIUG7426, West Al-Oraigah District, Abi Khashab"}
							</p>
						}
						isArabic={isArabic}
					/>

					<SupportInfoCard
						icon={<Phone className={iconClass} strokeWidth={1.5} />}
						title={isArabic ? "رقم الدعم" : "Support number"}
						body={
							<a
								href="tel:+47966599966"
								className="block text-start underline-offset-2 active:underline"
								dir="ltr"
							>
								+47966599966
							</a>
						}
						isArabic={isArabic}
					/>

					<SupportInfoCard
						icon={<Mail className={iconClass} strokeWidth={1.5} />}
						title={
							isArabic ? "راسلنا عبر البريد الإلكتروني" : "Email us"
						}
						body={
							<a
								href="mailto:info@shellafood.com"
								className="block text-start underline-offset-2 active:underline"
								dir="ltr"
							>
								info@shellafood.com
							</a>
						}
						isArabic={isArabic}
					/>
				</div>
			</div>
		</ProfileSubpageShell>
	);
}
