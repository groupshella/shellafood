import { Metadata } from "next";
import ConfirmationPage from "@/features/booking/components/ConfirmationPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  let { service } = await params;
  service = decodeURIComponent(service);

  return {
    title: `تم تأكيد الحجز - ${service} | Shella Serve`,
    description: `تم تأكيد حجزك لخدمة ${service} بنجاح عبر منصة شيلا سيرف. نتطلع لخدمتك قريباً.`,
    keywords: [
      service,
      "تأكيد الحجز",
      "تم الحجز",
      "Shella Serve",
      "شيلا سيرف",
      "خدمات منزلية",
    ],

    authors: [{ name: "Shella Services" }],
    creator: "Shella Services",
    publisher: "Shella Services",

    openGraph: {
      title: `تم تأكيد الحجز - ${service} | Shella Serve`,
      description: `تم تأكيد حجزك لخدمة ${service} بنجاح عبر منصة شيلا سيرف`,
      type: "website",
      url: `https://shella-serve.vercel.app/${service}/book/confirmation`,
      siteName: "Shella Serve",
      locale: "ar_SA",
      alternateLocale: ["en_US"],
      images: [
        {
          url: "/og-serve-me.jpg",
          width: 1200,
          height: 630,
          alt: `تم تأكيد الحجز - ${service} | Shella Serve`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `تم تأكيد الحجز - ${service} | Shella Serve`,
      description: `تم تأكيد حجزك لخدمة ${service} بنجاح عبر منصة شيلا سيرف`,
      images: ["/og-serve-me.jpg"],
      creator: "@shella_serve",
    },

    robots: {
      index: false, // 🔐 confirmation pages should never be indexed
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
      canonical: `https://shella-serve.vercel.app/${service}/book/confirmation`,
      languages: {
        "ar-SA": `https://shella-serve.vercel.app/${service}/book/confirmation`,
        "en-US": `https://shella-serve.vercel.app/${service}/book/confirmation`,
      },
    },

    metadataBase: new URL("https://shella-serve.vercel.app"),
  };
}

export default async function ConfirmationPageRoute({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  let { service } = await params;
  service = decodeURIComponent(service);

  return (
    <ConfirmationPage
      service={service}
    />
  );
}
