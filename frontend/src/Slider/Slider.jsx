import React, { useEffect, useState, useContext, useRef } from 'react';
import './Slider.scss';
import MyContext from '../Context/MyContext';
import axios from 'axios';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const Slider = () => {
  const { apiUrl } = useContext(MyContext);
  const [images, setImages] = useState([]);
  const sliderRef = useRef(null);
  const scrollInterval = useRef(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${apiUrl}/api/slider`);
      const imgs = res.data.data.map(i => ({
        url: `${apiUrl}${i.imageUrl}`,
        route: i.productRoute || '/' // fallback if route is missing
      }));
      setImages([...imgs,...imgs]); // duplicate for infinite scroll
    };
    fetch();
  }, [apiUrl]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += 300;
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    scrollInterval.current = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += 1;
        if (
          sliderRef.current.scrollLeft >=
          sliderRef.current.scrollWidth / 2
        ) {
          sliderRef.current.scrollLeft = 0;
        }
      }
    }, 20);
  };

  const stopAutoScroll = () => {
    clearInterval(scrollInterval.current);
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [images]);

  return (
    <div
      className="slider-wrapper"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <button className="arrow left" onClick={scrollLeft}>
        <IoIosArrowBack />
      </button>

      <div className="slider" ref={sliderRef}>
        <div className="slide-track">
          {images.map((img, idx) => (
            <div className="slide" key={idx}>
             <Link to={img.route}>
  <img src={img.url} alt={`Slide ${idx}`} />
</Link>
            </div>
          ))}
        </div>
      </div>

      <button className="arrow right" onClick={scrollRight}>
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Slider;
