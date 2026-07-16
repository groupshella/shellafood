"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { resolveProfileImageUrl } from "@/features/profile/lib/profile.lib";

interface ProfileAvatarProps {
	src?: string | null;
	alt: string;
	size?: number;
	className?: string;
}

export function ProfileAvatar({
	src,
	alt,
	size = 64,
	className = "",
}: ProfileAvatarProps) {
	const [hasError, setHasError] = useState(false);
	const resolvedSrc = resolveProfileImageUrl(src);
	const showImage = Boolean(resolvedSrc) && !hasError;
	const isLocalSrc =
		resolvedSrc?.startsWith("blob:") || resolvedSrc?.startsWith("data:");

	useEffect(() => {
		setHasError(false);
	}, [resolvedSrc]);

	return (
		<div
			className={`relative shrink-0 overflow-hidden rounded-full bg-card ${className}`}
			style={{ width: size, height: size }}
		>
			{showImage ? (
				<Image
					src={resolvedSrc!}
					alt={alt}
					fill
					className="rounded-full object-cover"
					unoptimized={isLocalSrc}
					onError={() => setHasError(true)}
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center">
					<User
						className="text-muted"
						style={{ width: size * 0.5, height: size * 0.5 }}
						strokeWidth={1.5}
						aria-hidden
					/>
				</div>
			)}
		</div>
	);
}
