import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./css/Globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Black Lyon Entertainment",
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