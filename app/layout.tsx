import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrepAI — AI Interview Coach",
  description:
    "Ace your next interview with real-time AI coaching. Get live feedback on confidence, eye contact, speech clarity, and emotional presence.",
  keywords: ["interview", "AI coach", "job preparation", "confidence", "speech analysis"],
  authors: [{ name: "PrepAI" }],
  openGraph: {
    title: "PrepAI — AI Interview Coach",
    description:
      "Real-time AI coaching for your next big interview. Instant feedback on confidence, eye contact, and communication.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
