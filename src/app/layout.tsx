import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/patterns.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DyDxSoft Portfolio",
  description: "DyDxdYdX portfolio",
  keywords: ["software development", "portfolio", "web development", "TypeScript", "Next.js"],
  authors: [{ name: "DyDxSoft" }],
  creator: "DyDxSoft",
  publisher: "DyDxSoft",
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
  openGraph: {
    title: "DyDxSoft Portfolio",
    description: "DyDxdYdX portfolio",
    url: 'https://dydxsoft.my',
    siteName: 'DyDxSoft Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DyDxSoft Portfolio',
    description: 'DyDxdYdX portfolio',
    creator: '@dykes_dexter',
  },
  verification: {
    google: 'FYqGpo8UyDIbr1PMcoPVs9kRIydau3sHQdzvktzUhgI',
  },
  alternates: {
    canonical: 'https://dydxsoft.my',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
