import { Metadata } from 'next';
import CartPage from '@/features/cart/components/CartPage';
import { cookies } from 'next/headers';
import { STORAGE_KEYS, getBaseUrl } from '@/features/auth/constants/auth.constants';

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
    images: [{ url: '/og-cart.jpg', width: 1200, height: 630, alt: 'سلة التسوق - شلة فود' }],
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
    languages: { 'ar-SA': 'https://shellafood.com/cart', 'en-US': 'https://shellafood.com/cart' },
  },
  metadataBase: new URL('https://shellafood.com'),
};

async function getCartData(guestId: string | null) {
  if (!guestId) return null;
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/cart?guest_id=${guestId}`, {
      method: 'GET',
      headers: { Accept: 'application/json', 'x-localization': 'ar' },
      cache: 'no-store',
    });
    if (!response.ok) {
      console.error('[Cart] API route error:', response.status);
      return null;
    }
    const data = await response.json();
    return data.cart_items;
  } catch (error) {
    console.error('[Cart] Fetch Error:', error);
    return null;
  }
}

export default async function CartPageRoute() {
  const cookieStore = await cookies();
  const guestId = cookieStore.get('guest_id');
  const authToken = cookieStore.get(STORAGE_KEYS.TOKEN)?.value || '';
  const cartData = await getCartData(guestId?.value || null);
  return <CartPage initialCartData={cartData} token={authToken} />;
}