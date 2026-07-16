"use client";

import type { ReactNode } from "react";

interface ProfileSectionProps {
	title: string;
	children: ReactNode;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
	return (
		<section className="mx-auto w-full">
			<h2 className="mb-2 px-3 text-start text-[15px] font-bold leading-[160%] text-muted sm:px-4 sm:text-[16px] md:px-5 md:text-[17px]">
				{title}
			</h2>
			<div className="grid grid-cols-1 gap-1.5 overflow-hidden rounded-2xl bg-background py-3 shadow-[0px_4px_8.9px_rgba(0,0,0,0.03)] sm:gap-2 sm:py-4 md:grid-cols-2 md:gap-2 md:py-5 lg:grid-cols-3 lg:gap-2.5">
				{children}
			</div>
		</section>
	);
}
