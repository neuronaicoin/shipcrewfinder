import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShipCrewFinder — Global Maritime Career Platform",
  description:
    "The professional platform for seafarers and yacht crew worldwide. Find jobs, build verified profiles, and connect with maritime companies directly.",
  keywords: [
    "seafarer jobs",
    "yacht crew jobs",
    "maritime careers",
    "ship crew recruitment",
    "global seafarer platform",
  ],
  authors: [{ name: "ShipCrewFinder" }],
  openGraph: {
    title: "ShipCrewFinder — Global Maritime Career Platform",
    description:
      "The professional platform for seafarers and yacht crew worldwide.",
    type: "website",
    locale: "en_US",
    siteName: "ShipCrewFinder",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipCrewFinder",
    description: "Global maritime career platform for seafarers and yacht crew.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${bricolage.variable} font-sans`}>
        {children}

        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8NLPGN4146"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8NLPGN4146');
          `}
        </Script>
      </body>
    </html>
  );
}
