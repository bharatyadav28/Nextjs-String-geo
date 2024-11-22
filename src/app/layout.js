import { Inter } from "next/font/google";

import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";
import "./App.css";

export const metadata = {
  title: "String Geo",
  description: "String Geo web app",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
