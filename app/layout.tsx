import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lindol PH",
    template: "%s — Lindol PH",
  },
  description:
    "Seismic analytics dashboard for Philippine earthquake activity. Fetches live USGS data, computes regional energy estimates via Gutenberg-Richter, and visualizes activity trends. Deployed on AWS EC2 via Docker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
      )}
    >
      <body className="mx-auto flex min-h-full max-w-7xl flex-col px-6 py-12">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
