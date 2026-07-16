const STEPS = [
	{
		ar: "1- قم بدعوة أصدقائك والشركات",
		en: "1- Invite your friends and businesses",
	},
	{
		ar: "2- يقومون بالتسجيل في شلة مع عرض خاص",
		en: "2- They sign up to Shella with a special offer",
	},
	{
		ar: "3- لقد حققت مكاسبك !",
		en: "3- You earn your rewards!",
	},
] as const;

export function ReferralHowItWorksCard({ isArabic }: { isArabic: boolean }) {
	return (
		<div className="grid w-full grid-cols-1 items-start gap-2 rounded-xl bg-brand/10 p-3 sm:p-4 md:grid-cols-3 md:gap-4">
			<h3 className="w-full text-start text-[16px] font-bold leading-[160%] text-foreground md:col-span-3">
				{isArabic ? "كيف يعمل ؟" : "How it works?"}
			</h3>
			{STEPS.map((step) => (
				<p
					key={step.en}
					className="w-full rounded-lg bg-background/45 p-2 text-start text-[15px] font-bold leading-[160%] text-foreground sm:text-[16px]"
				>
					{isArabic ? step.ar : step.en}
				</p>
			))}
		</div>
	);
}
