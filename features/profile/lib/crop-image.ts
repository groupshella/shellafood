export async function cropProfileImage(
    imageSrc: string,
    zoom: number,
    offsetX: number,
    offsetY: number,
    outputSize = 512,
): Promise<Blob> {
    const image = await loadImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    const baseScale = Math.max(outputSize / image.width, outputSize / image.height);
    const scale = baseScale * zoom;
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    const x = (outputSize - drawWidth) / 2 + offsetX;
    const y = (outputSize - drawHeight) / 2 + offsetY;
    ctx.beginPath();
    ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(image, x, y, drawWidth, drawHeight);
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error("Failed to crop image"))),
            "image/jpeg",
            0.92,
        );
    });
}
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
