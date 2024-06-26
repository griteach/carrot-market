import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--roboto-text",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Carrot market",
    default: "Carrot market",
  },
  description: "Sell and buy all the things!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} bg-neutral-900 text-white max-w-screen-md  mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
