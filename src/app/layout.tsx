import type { Metadata } from "next";
import { Geist, Geist_Mono, Edu_SA_Beginner } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jersey15Font = Edu_SA_Beginner({
  variable: "--font-jersey15",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Baby Running Game",
  description: "An endless runner game featuring a baby avoiding obstacles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jersey15Font.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
