import type { Metadata } from "next";
import { Roboto, Rubik_Scribble } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const gangwonbold = localFont({
  src: "./gangwonbold.otf",
  variable: "--gangwonbold-text",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--roboto-text",
});

const rubik = Rubik_Scribble({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--rubik-text",
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
  console.log(gangwonbold);
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${rubik.variable} ${gangwonbold.variable}  bg-neutral-900 text-white max-w-screen-sm  mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
