import type { Metadata } from "next";
import Script from "next/script";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { faqJsonLd } from "@/lib/faq-schema";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anatomy of a Character Call",
  description:
    "What actually happens in the milliseconds between a user speaking and an avatar responding. A layer-by-layer look at Runway Characters and GWM-1.",
  openGraph: {
    title: "Anatomy of a Character Call",
    description:
      "What actually happens in the milliseconds between a user speaking and an avatar responding.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anatomy of a Character Call",
    description:
      "What actually happens in the milliseconds between a user speaking and an avatar responding.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="bg-bg text-ink antialiased">
        {children}
        <Script
          src="https://cdn.dev.runwayml.com/prod/widget.js"
          data-pub-key="pub_8a7fe826f267bd90680d558ad44ec9aece01a450b2d5e88afd81ecf4b92f5fea"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
