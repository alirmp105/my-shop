"use client"
import "@/app/styles/globals.css";

import Provider from "@/components/SessionProvider";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/lib/cart-context";
import localFont from "next/font/local";


const vazirFont = localFont({
  src: [
    {
      path: "./fonts/vazirMatn/Vazirmatn-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/vazirMatn/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/vazirMatn/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/vazirMatn/Vazirmatn-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
  ],
  variable: "--font-vazir-matn",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={vazirFont.variable}>
      <body>
         <Provider>
        <DirectionProvider direction="rtl">
         
            <CartProvider>
            <div className="w-full min-w-0" >
               {children}
            </div>
            </CartProvider>
          
          <Toaster />
        </DirectionProvider>
        </Provider>
      </body>
    </html>
  );
}
