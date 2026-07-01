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

export const metadata: Metadata = {
  title: "Buddha Dharma Sutra | A Digital Sanctuary",
  description: "Explore the profound teachings of the Buddha, read sacred sutras, and access a vast library of Dhamma books.",
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
