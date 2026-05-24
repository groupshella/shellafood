import { Metadata } from "next";
import BookingSummaryPage from "@/features/booking/components/BookingSummaryPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  let { service } = await params;
  service = decodeURIComponent(service);

  return {
    title: `ملخص الحجز - ${service} | Shella Serve`,
    description: `راجع ملخص حجزك لخدمة ${service}. تأكد من تفاصيل الخدمة، السعر، والموقع قبل إتمام الدفع عبر منصة شيلا سيرف.`,
    keywords: [
      service,
      "ملخص الحجز",
      "ملخص الطلب",
      "Shella Serve",
      "شيلا سيرف",
      "حجز خدمة",
      "منصة خدمات",
    ],
    authors: [{ name: "Shella Services" }],
    creator: "Shella Services",
    publisher: "Shella Services",

    openGraph: {
      title: `ملخص الحجز - ${service} | Shella Serve`,
      description: `راجع ملخص حجزك لخدمة ${service} عبر منصة شيلا سيرف`,
      type: "website",
      url: `https://shella-serve.vercel.app/${service}/book/summary`,
      siteName: "Shella Serve",
      locale: "ar_SA",
      alternateLocale: ["en_US"],
      images: [
        {
          url: "/og-serve-me.jpg",
          width: 1200,
          height: 630,
          alt: `ملخص الحجز - ${service} | Shella Serve`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `ملخص الحجز - ${service} | Shella Serve`,
      description: `راجع ملخص حجزك لخدمة ${service} عبر منصة شيلا سيرف`,
      images: ["/og-serve-me.jpg"],
      creator: "@shella_serve",
    },

    robots: {
      index: false, // ✅ correct for checkout/summary pages
      follow: true,
      googleBot: {
        index: false,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: `https://shella-serve.vercel.app/${service}/book/summary`,
      languages: {
        "ar-SA": `https://shella-serve.vercel.app/${service}/book/summary`,
        "en-US": `https://shella-serve.vercel.app/${service}/book/summary`,
      },
    },

    metadataBase: new URL("https://shella-serve.vercel.app"),
  };
}

export default async function BookingSummaryPageRoute({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  let { service } = await params;
  service = decodeURIComponent(service);
  return <BookingSummaryPage service={service} />;
}
