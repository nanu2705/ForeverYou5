import React from 'react';
import './ProductCard.scss';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.productimg} alt={product.productname} />
      <h4>{product.productbrand}  </h4>
      <p>{product.productname}</p>
      <div className="price">
        ₹{product.productprice} <del>₹{product.productoldprice}</del>
      </div>
    </div>
  );
};

export default ProductCard;
