import React, { useContext, useEffect, useState } from 'react';
import './Wishlist.scss';
import axios from 'axios';
import MyContext from '../Context/MyContext';
import { Helmet } from 'react-helmet-async';

const Wishlist = () => {
  const {apiUrl, wish, setWish, removeProductFromWish, token  } = useContext(MyContext);
  const [loading, setLoading] = useState(true);

  // for wish items fetching start
  useEffect(() => {
    const fetchWishItems = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
  
      try {
        const { data } = await axios.get(`${apiUrl}/wish`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setWish(data.wishInfo);
        sessionStorage.setItem('wish', JSON.stringify(data.wishInfo));
      } catch (error) {
        console.error('Failed to fetch wish details:', error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWishItems();
  }, [token, apiUrl, setWish]);
  
  // for wish items fetching end

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="wishlist-container">
      <Helmet>
        <title>Wishlist</title>
        <meta name="description" content="Wishlist page" />
      </Helmet>      
      {wish && <h1>Wish Details</h1>}
      {wish && wish.length > 0 ? (
        <>
          {wish
  .sort((a, b) => b._id.localeCompare(a._id))
  .map((item) => (
    <div className="wishlist-item" key={item.productid}>
      
      
        <img
          src={item.productimg}
          alt={item.productname}
          className="wishlist-item-img"
        />
     

      <div className="wishlist-item-details">      
         <span>{item.productbrand}</span>
          <h3>{item.productname}</h3>
   

        <p>Price: ₹{item.productprice}</p>

        <div className="wishlist-item-controls">
          <button onClick={() => removeProductFromWish(item.categoryid, item.productid)}>
            Remove
          </button>
           
        </div>
      </div>
    </div>
  ))}

        </>
      ) : (
        <p>No wish data</p>
      )}
    </div>
  );
};

export default Wishlist;
