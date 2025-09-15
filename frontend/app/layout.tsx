import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./css/Globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const montserrat = Montserrat({
//   variable: "--font-montserrat",
//   subsets: ["latin"],
//   weight: ['700', '900'],
// });

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Black Lyon",
  description: "Official Black Lyon Studio Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.className} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}