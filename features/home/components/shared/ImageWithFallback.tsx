"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc?: string;
}

export function ImageWithFallback({ src, fallbackSrc = "/placeholder.png", onError, ...props }: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src);

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
