import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_LANG = 'ar';
const REQUEST_TIMEOUT = 10_000;

const UPSTREAM_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shellafood.com';

function buildForwardHeaders(request: NextRequest, lang: string): Record<string, string> {
	const forwardHeaders: Record<string, string> = {
		Accept: 'application/json',
		'X-LANG': lang,
	};

	const headersToForward = [
		'user-agent',
		'accept-language',
		'accept-encoding',
		'cf-connecting-ip',
		'x-forwarded-for',
		'x-real-ip',
	];
	for (const header of headersToForward) {
		const value = request.headers.get(header);
		if (value) forwardHeaders[header] = value;
	}

	return forwardHeaders;
}

export async function GET(request: NextRequest) {
	const lang =
		request.headers.get('X-LANG') ||
		request.nextUrl.searchParams.get('lang') ||
		DEFAULT_LANG;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

	try {
		const url = `${UPSTREAM_BASE}/api/v1/zone/list`;
		const response = await fetch(url, {
			method: 'GET',
			headers: buildForwardHeaders(request, lang),
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			const body = await response.text().catch(() => '');
			console.error(`[Zones list proxy] Upstream error ${response.status}:`, body.slice(0, 200));
			return NextResponse.json(
				{ error: 'External API request failed', status: response.status },
				{ status: response.status, headers: { 'Cache-Control': 'no-store' } }
			);
		}

		const data = await response.json();
		return NextResponse.json(data, {
			headers: { 'Cache-Control': 'no-store' },
		});
	} catch (error: unknown) {
		clearTimeout(timeoutId);
		if (error instanceof Error && error.name === 'AbortError') {
			return NextResponse.json({ error: 'Request timeout' }, { status: 504 });
		}
		console.error('[Zones list proxy]', error);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}
