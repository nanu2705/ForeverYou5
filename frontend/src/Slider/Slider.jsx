import React from 'react';
import './Slider.scss';

import img2 from '../Images/jewel1.jpg';
import img3 from '../Images/lehengha1.jpg';
import img4 from '../Images/lehengha2.jpg';
import img5 from '../Images/lehengha3.jpg';
import img6 from '../Images/lehengha4.jpg';
import img7 from '../Images/lehengha5.jpg';
import img8 from '../Images/jewel2.jpg';
import img9 from '../Images/lehengha8.jpg';
import img10 from '../Images/lehengha7.jpg';
import img11 from '../Images/lehengha9.jpg';

const images = [
  img2, img3, img4, img5, img6, img7, img8, img9, img10, img11,
];

const Slider = () => {
  return (
    <div className="slider">
      <div className="slides">
        {[...images, ...images].map((img, index) => (
          <img key={index} src={img} alt={`Slide ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
