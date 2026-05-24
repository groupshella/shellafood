// Media upload limits
export const MEDIA_LIMITS = {
	MAX_IMAGES: 5,
	MAX_VIDEO_SIZE: 50 * 1024 * 1024, // 50MB in bytes
	MAX_VIDEO_DURATION: 30, // seconds
} as const;

// Allowed video file types
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'] as const;
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm'] as const;