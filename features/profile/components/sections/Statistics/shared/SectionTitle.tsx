import { TAJAWAL } from "@/features/profile/constants/statistics.constants";

export function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2
			className="text-start text-[16px] font-bold leading-[160%] text-foreground sm:text-[17px]"
			style={TAJAWAL}
		>
			{children}
		</h2>
	);
}
