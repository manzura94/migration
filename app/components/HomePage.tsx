"use client";

import Link from "next/link";
import React from "react";

const Homepage = () => {
  return (
    <main id="homepage" className="mainpage">
      <section className="homepage homepage__container">
        <video autoPlay muted loop id="hero-video" playsInline>
          <source src="/video/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="homepage__banner">
          <h1 className="homepage__title">
            <i>Enjoy</i> premium <br />
            coffee at our charming cafe
          </h1>
          <p className="homepage__desc">
            With its inviting atmosphere and delicious coffee options, the
            Coffee House Resource is a popular destination for coffee lovers and
            those seeking a warm and inviting space to enjoy their favorite
            beverage.
          </p>
          <Link href="/menu" className="homepage__button">
            <span>Menu</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
