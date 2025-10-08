import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { OrdersProvider } from "@/context/OrdersContext";
import "./globals.css";

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
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-[url('/fondo-bosque.jpg')] bg-cover bg-fixed bg-center bg-black/60 bg-blend-multiply`}
      >
        <AuthProvider>
          <OrdersProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              {children}
            </div>
          </OrdersProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
