import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import MobileTabBar from "@/app/components/mobile-tabbar";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1030",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://shipcrewfinder.com"),
  title: "ShipCrewFinder — Global Maritime Career Platform",
  description:
    "Verified seafarers and shipping companies, connected directly. Jobs, CV builder, sea time tracker, live crew chat — 0% commission, ever.",
  keywords: [
    "seafarer jobs",
    "yacht crew jobs",
    "maritime careers",
    "ship crew recruitment",
    "global seafarer platform",
  ],
  authors: [{ name: "ShipCrewFinder" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ShipCrewFinder",
  },
  verification: {
    other: {
      "msvalidate.01": "9CB03E8E93C7289160D5677D71AB3ACB",
    },
  },
  openGraph: {
    title: "ShipCrewFinder — Global Maritime Career Platform",
    description:
      "Verified seafarers and shipping companies, connected directly. Jobs, CV builder, sea time tracker, live crew chat — 0% commission, ever.",
    url: "/",
    type: "website",
    locale: "en_US",
    siteName: "ShipCrewFinder",
    images: [
      {
        url: "/opengraph-image?v=2",
        width: 1200,
        height: 630,
        alt: "ShipCrewFinder — Global Maritime Career Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipCrewFinder — Global Maritime Career Platform",
    description: "Verified seafarers and shipping companies, connected directly. 0% commission, ever.",
    images: ["/opengraph-image?v=2"],
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
        <MobileTabBar />

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
