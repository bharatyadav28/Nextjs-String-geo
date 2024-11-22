import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import FooterLogo from "./FooterLogo";
import "./Footer.css";
import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import {
  SlSocialFacebook,
  SlSocialInstagram,
  SlSocialLinkedin,
} from "react-icons/sl";
import { LiaTelegram } from "react-icons/lia";
import { FiFacebook } from "react-icons/fi";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const googlePlayLink =
    "https://play.google.com/store/apps/details?id=your-app-package-name";
  const appleStoreLink = "https://apps.apple.com/us/app/your-app-id";

  const currentYear = new Date().getFullYear();

  const socialIcons = [
    { icon: FaXTwitter, link: "https://twitter.com/StringReveals" },
    { icon: FaFacebookF, link: "https://www.facebook.com/m.vinodh.kumar" },
    { icon: FaInstagram, link: "https://www.instagram.com/stringreveals" },
    {
      icon: FaLinkedinIn,
      link: "https://www.linkedin.com/in/vinodh-kumar-a46982199/",
    },
    { icon: FaTelegramPlane, link: "https://t.me/StringOfficial", size: 21 },
    // { icon: FaWhatsapp, link: '' },
    // { icon: FaYoutube, link: '' }
  ];

  const pages = [
    { title: "About Us", link: "/about" },
    { title: "Pricing Policy", link: "/pricing-policy" },
    { title: "Legal", link: "/legal" },
    { title: "Terms and Conditions", link: "/terms-condition" },
    { title: "Privacy Policy", link: "/privacy-policy" },
    { title: "Refund Policy", link: "/refund-policy" },
    { title: "FAQ", link: "/faq" },
    { title: "Contact Us", link: "/contact-us" },
  ];

  const logoBtn = () => {
    return (
      <>
        <FooterLogo />
        <br />
        <Button
          variant="transparent"
          className="rounded-pill text-white px-5 mt-4 donate-btn text-nowrap"
          onClick={() => router.push("/donate")}
        >
          Donate Now
        </Button>
      </>
    );
  };

  const allSocialIcons = () => {
    return (
      <div className="social-icons-container">
        {socialIcons.map((socialIcon, index) => (
          <a
            href={socialIcon?.link}
            target="_blank"
            rel="noopener noreferrer"
            key={socialIcon?.link}
          >
            <socialIcon.icon
              size={socialIcon?.size || 20}
              className="social-icon"
            />
          </a>
        ))}
      </div>
    );
  };

  const allPages = () => {
    return (
      <div className="d-flex flex-wrap align-items-center justify-content-center noto-sans">
        {pages.map((page, i) => (
          <React.Fragment key={page?.title}>
            <Link
              href={page?.link}
              className={`page-link ${
                pathname.includes(page?.link) ? "active" : ""
              }`}
              style={{ textDecoration: "none", color: "white" }}
            >
              {page?.title}
            </Link>
            {i !== pages.length - 1 && <span className="mx-2">•</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const copyright = () => {
    return (
      <p className="copy-right verdana">
        &copy; {currentYear} String Art Pvt. Ltd. All rights reserved
      </p>
    );
  };

  const appBtns = () => {
    return (
      <div style={{ maxWidth: "250px" }}>
        <h6 className="text-white text-center text-nowrap fw-bold  verdana">
          Download StringGeo App
        </h6>

        <div className="d-flex align-items-center justify-content-evenly">
          <Image
            src="/appstore.png"
            className="m-1"
            fluid
            style={{ maxWidth: "105px", aspectRatio: "4/1.5" }}
          />
          <Image
            src="/playstore.png"
            className="m-1"
            fluid
            style={{ maxWidth: "105px", aspectRatio: "4/1.5" }}
          />
        </div>
      </div>
    );
  };

  return (
    <footer className="footer-section p-1">
      <div className="d-none d-lg-block">
        <Row className="">
          <Col className="p-3 py-4 text-lg-left text-center">{logoBtn()}</Col>

          <Col style={{ flex: "3 0" }} className="mt-3  text-center h-100">
            <div>
              <Row className="">
                <Col>{allPages()}</Col>
              </Row>

              <Row className="mt-3 justify-content-center">
                <Col className="">{allSocialIcons()}</Col>
              </Row>

              <Row className="mt-4">
                <Col className=" text-center ">{copyright()}</Col>
              </Row>
            </div>
          </Col>

          <Col className=" text-center px-3 py-4 ">{appBtns()}</Col>
        </Row>
      </div>

      <div className="d-lg-none">
        <Row>
          <Col className="text-center py-3">{logoBtn()}</Col>
        </Row>
        <div className="px-sm-4 px-1 my-3 d-flex justify-content-evenly">
          <div>
            {pages?.slice(0, 4).map((page, i) => (
              <Link
                href={page?.link}
                key={page?.link}
                className={`page-link my-1 ${
                  pathname.includes(page?.link) ? "active" : ""
                }`}
                style={{ textDecoration: "none", color: "white" }}
              >
                {page?.title}
              </Link>
            ))}
          </div>
          <div>
            {pages?.slice(4, 8).map((page, i) => (
              <Link
                href={page?.link}
                key={page?.link}
                className={`page-link my-1 ${
                  pathname.includes(page?.link) ? "active" : ""
                }`}
                style={{ textDecoration: "none", color: "white" }}
              >
                {page?.title}
              </Link>
            ))}
          </div>
        </div>
        <Row className="">
          <Col className="py-3 d-flex justify-content-center">{appBtns()}</Col>
        </Row>
        <Row>
          <Col className="text-center py-3">{allSocialIcons()}</Col>
        </Row>
        <Row>
          <Col xs={12} className="text-center mt-2">
            {copyright()}
          </Col>
        </Row>
      </div>
    </footer>
  );
}

export default Footer;
