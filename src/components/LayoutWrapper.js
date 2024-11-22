"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import Aos from "aos";
import { Provider } from "react-redux";
import "aos/dist/aos.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SkeletonTheme } from "react-loading-skeleton";
import { Toaster } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import "react-phone-input-2/lib/style.css";
import "react-loading-skeleton/dist/skeleton.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./Header";
import Footer from "./Footer";
import store from "../store";
import ConnectionDetection from "./ConnectionDetection";
import useDetectDevTools from "@/utils/useDetectDevTools";
import usePreventScrollOnSpace from "@/utils/usePreventScrollOnSpace";
import Loader from "./Loader";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const isAccountPage = pathname.includes("account");
  const isAuthPage = pathname.includes("auth");
  const isShortsPage = pathname.match("/shorts");

  // const isDevToolsOpen = useDetectDevTools();
  const isDevToolsOpen = false;

  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <GoogleOAuthProvider clientId="6324397489-81envusj0p5170flss2evhqec45o4kfo.apps.googleusercontent.com">
      <Provider store={store}>
        {isDevToolsOpen ? (
          <div
            className="text-white"
            style={{
              backdropFilter: "blur(10px)",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>Sensitive information is obscured.</h1>
          </div>
        ) : (
          <>
            <Loader />
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 5000 }}
            />
            <SkeletonTheme
              baseColor="rgba(0,0,0,0.1)"
              highlightColor="rgba(250,250,250,0.1)"
              enableAnimation={true}
              duration={1}
            >
              {!isShortsPage && <Header />}
              {children}
              {isAccountPage || isAuthPage || isShortsPage ? null : <Footer />}
            </SkeletonTheme>
            <ConnectionDetection />
          </>
        )}
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default LayoutWrapper;
