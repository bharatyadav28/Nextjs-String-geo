import React from "react";
import { Image } from "react-bootstrap";
import { useRouter } from "next/navigation";

function FooterLogo() {
  const router = useRouter();

  return (
    <Image
      style={{ cursor: "pointer", maxHeight: "45px" }}
      fluid
      onClick={() => router.push("/")}
      src="/logo/string-geo-logo-white.png"
    />
  );
}

export default FooterLogo;
