import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foody Go",
  description: "Plataforma de entrega de alimentos a domicilio rápida y confiable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[url('/fondo-bosque.jpg')] bg-cover bg-fixed bg-center bg-black/60 bg-blend-multiply">
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
