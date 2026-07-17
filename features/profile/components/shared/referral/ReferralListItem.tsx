import Image from "@/shared/components/SecureImage";
import { Check, Timer, User } from "lucide-react";
import type { ReferralEntry } from "@/features/profile/types/referral.types";

interface ReferralListItemProps {
	entry: ReferralEntry;
	isArabic: boolean;
}

export function ReferralListItem({ entry, isArabic }: ReferralListItemProps) {
	return (
		<div className="flex min-h-14 items-center justify-between gap-3 border-b border-border py-2">
			<div className="flex min-w-0 items-center gap-2">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-card">
					{entry.avatarUrl ? (
						<Image
							src={entry.avatarUrl}
							alt=""
							width={32}
							height={32}
							className="h-8 w-8 object-cover"
						/>
					) : (
						<User className="h-4 w-4 text-foreground" strokeWidth={1.5} />
					)}
				</div>
				<span className="truncate text-[14px] font-bold text-foreground">
					{entry.name}
				</span>
			</div>

			<ReferralRowStatus entry={entry} isArabic={isArabic} />
		</div>
	);
}

function ReferralRowStatus({
	entry,
	isArabic,
}: {
	entry: ReferralEntry;
	isArabic: boolean;
}) {
	if (entry.status === "pending") {
		return (
			<span className="inline-flex shrink-0 items-center gap-1 rounded-[20px] bg-[#DFD3F5] p-1">
				<Timer className="h-4 w-4 text-foreground" strokeWidth={1.5} />
				<span className="text-[12px] font-medium text-foreground">
					{entry.statusLabel ??
						(isArabic ? "انتظار" : "Pending")}
				</span>
			</span>
		);
	}

	return (
		<div className="flex shrink-0 flex-col items-start gap-1">
			{entry.reward != null && (
				<div className="flex items-center gap-0.5 text-[16px] font-medium text-brand">
					<span>+</span>
					<span>{entry.rewardText ?? entry.reward}</span>
					{!entry.rewardText && <span className="text-[14px]">﷼</span>}
				</div>
			)}
			<span className="inline-flex items-center gap-1 rounded-[20px] bg-brand/10 p-1">
				<Check className="h-4 w-4 text-foreground" strokeWidth={2} />
				<span className="text-[12px] font-medium text-foreground">
					{entry.statusLabel ??
						(isArabic ? "تم التسجيل" : "Registered")}
				</span>
			</span>
		</div>
	);
}
