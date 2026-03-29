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
  metadataBase: new URL("https://r0.asius.in"),
  title: {
    default: "Resume Zero - The Minimalist, ATS-Optimized Resume Builder",
    template: "%s | Resume Zero",
  },
  description:
    "Resume Zero is the ultimate minimalist resume builder for professionals. Build ATS-optimized, high-impact resumes with zero clutter and zero friction in minutes.",
  openGraph: {
    title: "Resume Zero - The Minimalist, ATS-Optimized Resume Builder",
    description: "Resume Zero is the ultimate minimalist resume builder for professionals. Build ATS-optimized, high-impact resumes with zero clutter and zero friction in minutes.",
    url: "https://r0.asius.in",
    siteName: "Resume Zero",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Build your professional resume with Resume Zero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Zero - The Minimalist, ATS-Optimized Resume Builder",
    description: "Build ATS-optimized, high-impact resumes with zero clutter and zero friction in minutes.",
    images: ["/opengraph-image"],
  },
  keywords: ["resume builder", "ATS resume", "minimalist resume", "professional resume", "free resume maker", "career tools"],
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
