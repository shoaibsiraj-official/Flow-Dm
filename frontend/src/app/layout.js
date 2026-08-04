import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "FlowDM AI",
  description: "AI-powered Instagram DM automation for growing businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
