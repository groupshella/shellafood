"use client";

import { ProfileSubpageShell } from "@/features/profile/components/ProfileSubpageShell";
import { StaticContentBody } from "@/features/profile/components/shared/StaticContentBody";

interface StaticContentClientProps {
	title: string;
	content: string;
	isArabic: boolean;
}

export function StaticContentClient({ title, content, isArabic }: StaticContentClientProps) {
	return (
		<ProfileSubpageShell
			title={title}
			isArabic={isArabic}
			showHeaderBorder
			mainClassName="pb-8 pt-2 sm:px-6"
		>
			<StaticContentBody content={content} />
		</ProfileSubpageShell>
	);
}
