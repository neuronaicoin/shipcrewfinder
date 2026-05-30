import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
