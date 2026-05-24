import { Metadata } from "next";
import BookingDetailsPage from "@/features/booking/components/BookingDetailsPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const decodedService = decodeURIComponent(service);
  return {
    title: `حجز خدمة ${decodedService} | تفاصيل الحجز | شيلا سيرف`,
    description: `احجز خدمة ${service} بسهولة عبر منصة شيلا سيرف. اختر التاريخ، الوقت، والموقع المناسب لك.`,
    keywords: [
      decodedService,
      "تفاصيل الحجز",
      "حجز خدمة",
      "خدمات شيلا",
      "شيلا سيرف",
      "حجز موعد",
      "منصة خدمات",
    ],
    authors: [{ name: "Shella Services" }],
    creator: "Shella Services",
    publisher: "Shella Services",

    openGraph: {
      title: `حجز خدمة ${decodedService} | Shella Serve`,
      description: `احجز موعدك لخدمة ${decodedService} عبر منصة شيلا سيرف`,
      type: "website",
      url: `https://shella-serve.vercel.app/${decodedService}/book/details`,
      siteName: "Shella Serve",
      locale: "ar_SA",
      alternateLocale: ["en_US"],
      images: [
        {
          url: "/og-serve-me.jpg",
          width: 1200,
          height: 630,
          alt: `حجز خدمة ${decodedService} | Shella Serve`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `حجز خدمة ${decodedService} | Shella Serve`,
      description: `احجز موعدك لخدمة ${decodedService} عبر منصة شيلا سيرف`,
      images: ["/og-serve-me.jpg"],
      creator: "@shella_serve",
    },

    robots: {
      index: false,
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
      canonical: `https://shella-serve.vercel.app/${decodedService}/book/details`,
      languages: {
        "ar-SA": `https://shella-serve.vercel.app/${decodedService}/book/details`,
        "en-US": `https://shella-serve.vercel.app/${decodedService}/book/details`,
      },
    },

    metadataBase: new URL("https://shella-serve.vercel.app"),
  };
}


export default async function BookingDetailsPageRoute({
  params,
  searchParams,
}: {
  params: Promise<{ service: string }>;
  searchParams: Promise<{ title?: string }>;
}) {
  const { service } = await params;
  const { title } = await searchParams;

  // Decode the title if it exists
  const decodedTitle = title ? decodeURIComponent(title) : '';

  return (
    <BookingDetailsPage
      serviceId={service}
      title={decodedTitle}
    />
  );
}