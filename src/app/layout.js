import { Inter } from "next/font/google";
import Script from "next/script";

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
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PHP5H8HQ');
          `}
        </Script>

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </head>

      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PHP5H8HQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <noscript>You need to enable JavaScript to run this app.</noscript>

        <LayoutWrapper>
          <div id="root">{children}</div>
        </LayoutWrapper>

        <Script id="disable-right-click" strategy="afterInteractive">
          {`
            document.addEventListener('contextmenu', function (e) {
              e.preventDefault();
            });
          `}
        </Script>
      </body>
    </html>
  );
}
