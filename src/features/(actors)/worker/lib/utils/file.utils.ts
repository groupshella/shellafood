/**
 * File utility functions
 */

export async function urlToFile(url: string, filename: string): Promise<File | undefined> {
	if (!url) return undefined;
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		return new File([blob], filename, { type: blob.type });
	} catch (error) {
		console.error('Error converting URL to File:', error);
		return undefined;
	}
}

