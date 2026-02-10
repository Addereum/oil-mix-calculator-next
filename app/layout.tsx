import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        default: "2T Oil Mix Calculator",
        template: "%s · 2T Oil Mix Calculator",
    },
    description: "Calculate 2-stroke oil mix amounts with presets and custom ratios.",
    openGraph: {
        title: "2T Oil Mix Calculator",
        description: "Presets + custom ratio. Fast, mobile-friendly.",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "2T Oil Mix Calculator",
        description: "Presets + custom ratio. Fast, mobile-friendly.",
    },
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        </body>
        </html>
    );
}
