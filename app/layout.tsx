import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidebar } from "@/app/components/sidebar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MetalCom · Mantenimiento",
  description: "Gestión de máquinas y mantenimientos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans">
        <Suspense
          fallback={
            <>
              <div className="h-14 bg-steel md:hidden" />
              <div className="fixed inset-y-0 left-0 hidden w-64 bg-steel md:block" />
            </>
          }
        >
          <Sidebar />
        </Suspense>
        <div className="md:pl-64">{children}</div>
      </body>
    </html>
  );
}
