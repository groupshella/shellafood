"use client";

import Image from "@/shared/components/SecureImage";
import type { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { toSecureMediaUrl } from "@/shared/lib/media-url";

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc?: string;
}

export function ImageWithFallback({ src, fallbackSrc = "/placeholder.png", onError, ...props }: ImageWithFallbackProps) {
    const secureSrc = typeof src === "string" ? toSecureMediaUrl(src) : src;
    const [imgSrc, setImgSrc] = useState(secureSrc);

    useEffect(() => {
        setImgSrc(secureSrc);
    }, [secureSrc]);

    return (
        <Image
            {...props}
            src={imgSrc}
            onError={(event) => {
                setImgSrc(fallbackSrc);
                onError?.(event);
            }}
        />
    );
}
