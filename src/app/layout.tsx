import type { Metadata } from "next";
import { Outfit, Lora } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://buddha-dharma-sutra.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Buddha Dharma Sutra | A Digital Sanctuary",
    template: "%s | Buddha Dharma Sutra",
  },
  description: "Explore the profound teachings of the Buddha, read sacred sutras, and access a vast library of Dhamma books.",
  keywords: ["Buddha", "Dharma", "Sutra", "Buddhist", "Tripitaka", "Dhamma", "Meditation", "Buddhist Library", "Bangladesh"],
  openGraph: {
    title: "Buddha Dharma Sutra",
    description: "A digital sanctuary for Buddhist teachings, sutras, and literature.",
    url: siteUrl,
    siteName: "Buddha Dharma Sutra",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buddha Dharma Sutra",
    description: "A digital sanctuary for Buddhist teachings, sutras, and literature.",
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Buddha Dharma Sutra",
  "url": siteUrl,
  "description": "Explore the profound teachings of the Buddha, read sacred sutras, and access a vast library of Dhamma books.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${siteUrl}/library?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${lora.variable} font-sans h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full">
        <Providers>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#fff',
                color: '#043927',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                border: '1px solid rgba(5, 150, 105, 0.2)'
              },
            }}
          />
          <AnalyticsTracker />
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
