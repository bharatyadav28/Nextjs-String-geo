import React from "react";
import { Image } from "react-bootstrap";

import { useRouter } from "next/navigation";

function HeaderLogo({ maxHeight, height }) {
  const router = useRouter();

  return (
    <Image
      onClick={() => router.push("")}
      src={"/logo/string-geo-logo-white.png"}
      alt="String Geo"
      style={{
        maxHeight: `${maxHeight}`,
        height: `${height}`,
        cursor: "pointer",
      }}
      fluid
    />
  );
}

export default HeaderLogo;
