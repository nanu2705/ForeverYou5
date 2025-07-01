import React from "react";
import "./AboutPage.scss";

const AboutPage = () => {
  return (
    <section className="about-us">
      <div className="container">
        <h1 className="heading">About Us!</h1>
        <span>Welcome to Forever You!</span>
        <p className="intro">
          Founded by <strong>Mansi Patel</strong>, <strong>Foreveryou</strong> is a Vadodara-based fashion brand redefining the world of affordable,
          trendy, and inclusive clothing and jewelry. Born in <strong>2025</strong> from a deep-rooted passion for tradition and
          style, we celebrate the uniqueness of every individual — just like our tagline says:
        </p>
        <h2 className="tagline">“As Different As You.”</h2>

        <p>
          At Foreveryou, we believe fashion is not one-size-fits-all. That’s why our curated collections feature over
          <strong> 50+ styles</strong> of apparel and jewelry, crafted with love for <strong>women, men, and every beautiful body in between</strong>.
          Whether it’s a classic ethnic ensemble or everyday elegance, our pieces blend traditional charm with modern flair,
          making style accessible, expressive, and endlessly wearable.
        </p>

        <p>
          Though we currently operate from <strong>home</strong>, our designs have already started making waves through
          online platforms and word-of-mouth, proving that great style doesn't need a storefront — just vision, authenticity, and heart.
        </p>

        <p>
          From intricately designed jewelry to thoughtfully made <strong>plus-size-friendly outfits</strong>, Foreveryou is here to empower
          you to wear what feels right — not just what looks right.
        </p>

        <p>
          We’re not just building a brand — we’re building a <strong>community</strong> of bold, beautiful individuals who are proud to be themselves.
        </p>

        <div className="address">
          <h3>📍 Based In:</h3>
          <p>Vadodara, Gujarat</p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
