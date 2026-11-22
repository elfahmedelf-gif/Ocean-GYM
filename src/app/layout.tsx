import type { Metadata, Viewport } from "next";
import { Cairo, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ocean GYM | أوشن جيم — بحر من القوة",
  description:
    "Ocean GYM أقوى جيم بأحدث الأجهزة الأمريكية ومدربين معتمدين دوليًا. كلاسات جروب، بوكسينج، كروسفت، سبيننج، يوجا وباقات اشتراك مرنة لكل المستويات.",
  keywords: [
    "Ocean GYM",
    "جيم",
    "نادي رياضي",
    "كمال أجسام",
    "لياقة بدنية",
    "بوكسينج",
    "كروسفت",
  ],
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Ocean GYM | أوشن جيم",
    description: "بحر من القوة — انضم لعائلة Ocean GYM اليوم",
    images: ["/images/logo-wide.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050d1f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
