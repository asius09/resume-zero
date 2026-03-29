import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://resume-zero.vercel.app"),
  title: {
    default: "Resume Zero",
    template: "%s | Resume Zero",
  },
  description:
    "The minimalist, ATS-optimized resume builder for professionals. Zero friction, zero clutter.",
  openGraph: {
    title: "Resume Zero",
    description: "The minimalist, ATS-optimized resume builder for professionals.",
    url: "https://resume-zero.vercel.app",
    siteName: "Resume Zero",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Zero",
    description: "The minimalist, ATS-optimized resume builder for professionals.",
  },
  keywords: ["resume builder", "ATS resume", "minimalist resume", "professional resume", "free resume maker"],
  authors: [{ name: "Resume Zero Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
