import type { InviteDateGroup } from "@/features/profile/types/referral.types";
import { ReferralListItem } from "@/features/profile/components/shared/referral/ReferralListItem";

interface ReferralInvitedListProps {
	groups: InviteDateGroup[];
	isArabic: boolean;
}

export function ReferralInvitedList({ groups, isArabic }: ReferralInvitedListProps) {
	return (
		<div className="flex w-full flex-col gap-4">
			{groups.map((group) => (
				<section key={group.key}>
					<h3 className="mb-0 text-start text-[16px] font-bold text-muted">
						{group.label}
					</h3>
					<div>
						{group.entries.map((entry) => (
							<ReferralListItem
								key={entry.id}
								entry={entry}
								isArabic={isArabic}
							/>
						))}
					</div>
				</section>
			))}
		</div>
	);
}
