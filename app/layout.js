import { Tajawal } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700", "900"],
});

export const metadata = {
  title: "Math",
  description: "Mohamed Bar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.className} antialiased bg-white overflow-x-hidden`}
      >
        <Providers> {children}</Providers>
      </body>
    </html>
  );
}
