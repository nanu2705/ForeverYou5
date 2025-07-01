import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./TopCategory.scss";
import { useContext } from "react";
import MyContext from "../Context/MyContext";

const TopCategory = () => {
  const { ref } = useParams(); // 'women', 'men', etc.
  const [filteredData, setFilteredData] = useState([]);
  const { apiUrl } = useContext(MyContext);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/products-by-top-category/${ref}`);
        console.log("Fetched products:", res.data);
        setFilteredData(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchCategoryData();
  }, [ref, apiUrl]);

  return (
    <div className="top-category-page">
      {filteredData.map((cat) => (
        <div key={cat.route_category} className="category-section">
          <h2 className="category-title">{cat.category}</h2>
          <div className="product-grid">
            {cat.products.map((product) => (
              <Link
                key={product.id}
                to={`/category/${cat.route_category}/${product.route_productname}`}
                className="product-card"
              >
                <img
                  src={`${apiUrl}${product.productimg}`}
                  alt={product.productname}
                  className="product-image"
                />
                <h4 className="product-name">{product.productbrand}</h4>
                <p className="product-price">₹{product.productprice}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopCategory;
