import Image, { type ImageProps } from "next/image";
import { toSecureMediaUrl } from "@/shared/lib/media-url";

/**
 * Drop-in replacement for `next/image` that proxies HTTP backend media
 * through `/backend-media` to avoid HTTPS mixed-content blocks.
 */
export default function SecureImage({ src, ...props }: ImageProps) {
	const secureSrc = typeof src === "string" ? toSecureMediaUrl(src) : src;
	return <Image {...props} src={secureSrc} />;
}
