export function formatFileSize(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) {
        const rounded = Math.round(mb * 10) / 10;
        return rounded % 1 === 0 ? `${rounded} MB` : `${rounded.toFixed(1)} MB`;
    }
    const kb = Math.round(bytes / 1024);
    return `${kb} KB`;
}

export function validateUploadFile(file: File, maxBytes: number): string | null {
    if (file.size > maxBytes) return "fileTooLarge";
    return null;
}
