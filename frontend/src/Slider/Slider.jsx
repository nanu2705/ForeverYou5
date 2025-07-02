import React, { useEffect, useState, useContext } from 'react';
import './Slider.scss';
import MyContext from '../Context/MyContext';
import axios from 'axios';

const Slider = () => {
  const { apiUrl } = useContext(MyContext);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${apiUrl}/api/slider`);
      setImages(res.data.data.map(i => `${apiUrl}${i.imageUrl}`));
    };
    fetch();
  }, [apiUrl]);

  return (
    <div className="slider">
      <div className="slide-track">
        {[...images, ...images].map((img, idx) => (
          <div className="slide" key={idx}>
            <img src={img} alt={`Slide ${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
