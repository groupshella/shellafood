import { Metadata } from "next";
import { PickAndOrderPage } from "@/features/pick-and-order/components/Main/PickAndOrder";

export const metadata: Metadata = {
  title: "شلة  | منصة الخدمات المهنية",
  description:
    "منصة شلة سيرف تربط مقدمي الخدمات المهنية بطالبي الخدمات. جد الخبير المناسب أو اعرض خدماتك وابدأ العمل الآن.",
  keywords: [
    "خدمات مهنية",
    "مقدمي خدمات",
    "طلب خدمة",
    "عمالة ماهرة",
    "شلة سيرف",
    "shella serve",
    "freelance",
    "خدمات",
  ],
  authors: [{ name: "شلة سيرف" }],
  creator: "شلة سيرف",
  publisher: "شلة سيرف",
  openGraph: {
    title: "شلة سيرف | منصة الخدمات المهنية",
    description:
      "منصة شلة سيرف تربط مقدمي الخدمات المهنية بطالبي الخدمات. جد الخبير المناسب أو اعرض خدماتك وابدأ العمل الآن.",
    type: "website",
    url: "https://shella-serve.vercel.app/",
    siteName: "شلة سيرف",
    locale: "ar_SA",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-shella-serve.jpg",
        width: 1200,
        height: 630,
        alt: "شلة سيرف - منصة الخدمات المهنية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شلة سيرف | منصة الخدمات المهنية",
    description:
      "منصة شلة سيرف تربط مقدمي الخدمات المهنية بطالبي الخدمات. جد الخبير المناسب أو اعرض خدماتك.",
    images: ["/og-shella-serve.jpg"],
    creator: "@shellaserve",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shella-serve.vercel.app/",
    languages: {
      "ar-SA": "https://shella-serve.vercel.app/",
      "en-US": "https://shella-serve.vercel.app/",
    },
  },
  metadataBase: new URL("https://shella-serve.vercel.app"),
};
export default function PickAndOrderPageRoute() {
  return <PickAndOrderPage />;
}


