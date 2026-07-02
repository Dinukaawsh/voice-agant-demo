import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Twist Voice - Demo Mockup",
  description: "Beautiful UI mockup for AI Voice Agent platform demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
