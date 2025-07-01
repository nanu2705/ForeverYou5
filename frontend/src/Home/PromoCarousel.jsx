import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PromoCarousel.scss';
import { useContext } from 'react';
import MyContext from '../Context/MyContext';



const PromoCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  const {apiUrl} =useContext(MyContext)

  // Fetch banners from backend
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/promos`);
      setBanners(res.data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
    }
  };

  useEffect(() => {
    fetchBanners();
  },);

  // Change slide every 3s only if banners are loaded
  useEffect(() => {
    if (banners.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [banners]);

  if (banners.length === 0) {
    return <div className="promo-carousel">Loading banners...</div>;
  }

  const { title, description, imageUrl, ctaText, ctaLink } = banners[index];

  return (
    <section className="promo-carousel">
      <img src={imageUrl} alt={title} className="background" />
      <div className="overlay" />
      <div className="content">
        <h2>{title}</h2>
        <p>{description}</p>
        <a href={ctaLink} className="btn">{ctaText}</a>
      </div>
      <div className="indicators">
        {banners.map((_, i) => (
          <span
            key={i}
            className={i === index ? 'active' : ''}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default PromoCarousel;
