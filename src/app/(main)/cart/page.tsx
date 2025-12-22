import { Metadata } from 'next';
import CartPage from '@/features/cart/components/CartPage';
import { RegisterForm } from '@/features/auth';
import { cookies } from 'next/headers';
import { BASE_URL } from '@/features/auth/constants/auth.constants';

export const metadata: Metadata = {
  title: 'سلة التسوق | شلة فود',
  description: 'راجع عناصر سلة التسوق الخاصة بك، قم بتحديث الكميات، وتابع إلى الدفع. استمتع بطعام طازج يُقدم إلى باب منزلك.',
  keywords: ['سلة التسوق', 'توصيل الطعام', 'الدفع', 'تسوق عبر الإنترنت', 'شلة فود', 'طلبات الطعام'],
  authors: [{ name: 'شلة فود' }],
  creator: 'شلة فود',
  publisher: 'شلة فود',
  openGraph: {
    title: 'سلة التسوق | شلة فود',
    description: 'راجع سلة التسوق الخاصة بك وتابع إلى الدفع. إدارة عربة التسوق وإكمال طلبك بسهولة.',
    type: 'website',
    url: 'https://shellafood.com/cart',
    siteName: 'شلة فود',
    locale: 'ar_SA',
    alternateLocale: ['en_US'],
    images: [
      {
        url: '/og-cart.jpg',
        width: 1200,
        height: 630,
        alt: 'سلة التسوق - شلة فود',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سلة التسوق | شلة فود',
    description: 'راجع سلة التسوق الخاصة بك وتابع إلى الدفع بسهولة على شلة فود.',
    images: ['/og-cart.jpg'],
    creator: '@shellafood',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://shellafood.com/cart',
    languages: {
      'ar-SA': 'https://shellafood.com/cart',
      'en-US': 'https://shellafood.com/cart',
    },
  },
  metadataBase: new URL('https://shellafood.com'),
};

async function getCartData(token: string | null, guestId: string | null) {
	try {
		const apiUrl = `${BASE_URL}/api/v1/customer/cart/list`;
		
		const headers: HeadersInit = {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		};

		// Add authorization header if token exists
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		// Add guest ID header if guest ID exists and no token
		if (guestId && !token) {
			headers['X-Guest-ID'] = guestId;
		}

		const response = await fetch(apiUrl, {
			method: 'GET',
			headers,
			cache: 'no-store', // Don't cache this data
		});

		if (!response.ok) {
			console.error('[Cart] API Error:', response.status);
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('[Cart] Fetch Error:', error);
		return null;
	}
}

export default async function CartPageRoute() {
  // Check authentication on server side using the same cookie key as layout
	const cookieStore = await cookies();
	const authToken = cookieStore.get("auth_token");
	const guestId = cookieStore.get("guest_id");
	console.log("authToken", authToken?.value);
	console.log("guestId", guestId?.value);

	// Fetch cart data
	const cartData = await getCartData(
		authToken?.value || null,
		guestId?.value || null
	);

	return <CartPage initialCartData={cartData?.data || []} />;
}