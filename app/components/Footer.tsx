"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="contacts" className="footer footer__container">
      <div className="footer__left">
        <h2 className="footer__left__title">
          Sip, Savor, Smile. <i>It’s coffee time!</i>
        </h2>

        <div className="footer__left-socials socials">
          <div className="socials__icon kontakt">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="59"
                height="59"
                rx="29.5"
                stroke="#C1B6AD"
              />
              <path
                d="M41 21.0101C41 21.0101 38.9821 22.2022 37.86 22.5401C37.2577 21.8476 36.4573 21.3567 35.567 21.134C34.6767 20.9112 33.7395 20.9673 32.8821 21.2945C32.0247 21.6218 31.2884 22.2045 30.773 22.9638C30.2575 23.7231 29.9877 24.6224 30 25.5401V26.5401C28.2426 26.5856 26.5013 26.1959 24.931 25.4055C23.3607 24.6151 22.0103 23.4487 21 22.0101C21 22.0101 17 31.0101 26 35.0101C23.9405 36.408 21.4872 37.109 19 37.0101C28 42.0101 39 37.0101 39 25.5101C38.9991 25.2315 38.9723 24.9537 38.92 24.6801C39.9406 23.6735 41 21.0101 41 21.0101Z"
                stroke="#E1D4C9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="socials__icon instagram">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="59"
                height="59"
                rx="29.5"
                stroke="#C1B6AD"
              />
              <path
                d="M30 34C32.2091 34 34 32.2091 34 30C34 27.7909 32.2091 26 30 26C27.7909 26 26 27.7909 26 30C26 32.2091 27.7909 34 30 34Z"
                stroke="#E1D4C9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 34V26C21 23.2386 23.2386 21 26 21H34C36.7614 21 39 23.2386 39 26V34C39 36.7614 36.7614 39 34 39H26C23.2386 39 21 36.7614 21 34Z"
                stroke="#E1D4C9"
              />
              <path
                d="M35.5 24.51L35.51 24.4989"
                stroke="#E1D4C9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="socials__icon facebook">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="59"
                height="59"
                rx="29.5"
                stroke="#C1B6AD"
              />
              <path
                d="M35 20H32C30.6739 20 29.4021 20.5268 28.4645 21.4645C27.5268 22.4021 27 23.6739 27 25V28H24V32H27V40H31V32H34L35 28H31V25C31 24.7348 31.1054 24.4804 31.2929 24.2929C31.4804 24.1054 31.7348 24 32 24H35V20Z"
                stroke="#E1D4C9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="footer__right">
        <h3 className="footer__right-subtitle">Contact Us</h3>

        <div className="footer__right-contacts contacts">
          <Link
            href="https://maps.app.goo.gl/cKKgUaCrrADpdGM17"
            className="contacts__info address"
            target="_blank"
          >
            <span className="contacts__icon">
              <Image
                src="/images/icons/pin-alt.svg"
                alt="pin-alt"
                width={20}
                height={20}
              />
            </span>
            <p className="contacts__text">8558 Green Rd, LA</p>
          </Link>

          <Link href="tel:+4733378901" className="contacts__info phone">
            <span className="contacts__icon">
              <Image
                src="/images/icons/phone.svg"
                alt="phone"
                width={20}
                height={20}
              />
            </span>
            <p className="contacts__text">+1 (603) 555-0123</p>
          </Link>

          <div className="contacts__info">
            <span className="contacts__icon">
              <Image
                src="/images/icons/clock.svg"
                alt="clock"
                width={20}
                height={20}
              />
            </span>
            <p className="contacts__text">Mon–Sat: 9:00 AM – 11:00 PM</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
