import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Foody Go",
  description:
    "Plataforma de entrega de alimentos a domicilio rápida y confiable",
};

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} min-h-screen bg-[url('/fondo-bosque.jpg')] bg-cover bg-center bg-black/60 bg-blend-multiply md:bg-fixed`}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
