import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Category from "../Category/Category";
import Tshirt from "../Category/Tshirt";
import Slider from "../Slider/Slider";
import "./Home.scss";
import PromoCarousel from "./PromoCarousel";
import { useContext } from 'react';
import MyContext from '../Context/MyContext';

const Home = () => {
  const [topCategories, setTopCategories] = useState([]);
  const {apiUrl} =useContext(MyContext)

  useEffect(() => {
    axios.get(`${apiUrl}/api/top-categories`)
      .then(res => setTopCategories(res.data))
      .catch(err => console.error("Failed to fetch top categories", err));
  }, [apiUrl]);

  return (
    <div className="home">
      <Slider />
      
      <h3>Top Categories</h3>
      <div className="top-category-grid">
        {topCategories.map(cat => (
          <Link key={cat.id} to={`/top-category/${cat.categoryRef}`} className="top-category-card">
            <img src={cat.img} alt={cat.title} />
            <h4>{cat.title}</h4>
          </Link>
        ))}
      </div>

      <PromoCarousel />
      <h3>Shop by Categories</h3>
      <Category />
      <h3>You might also like</h3>
      <Tshirt />
    </div>
  );
};

export default Home;
