import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import MyContext from "../Context/MyContext";
import "./AdminWishlist.scss";

const AdminWishlist = () => {
  const { apiUrl } = useContext(MyContext);
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const adminToken = "YOUR_ADMIN_JWT_TOKEN";

  

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/api/admin/wishlists`, {
        headers: {
          Authorization: `Bearer`,
        },
      });
      setWishlists(res.data.data);
    } catch (err) {
      setError("Failed to fetch wishlists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlists();
  },[]);

  const handleRemoveWishItem = async (email, categoryid, productid) => {
    try {
      await axios.delete(`${apiUrl}/api/admin/wishlist/${email}/${categoryid}/${productid}`, {
        headers: {
          Authorization: `Bearer `,
        },
      });
      alert("Item removed from wishlist");
      fetchWishlists();
    } catch (err) {
      alert("Failed to remove item.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading wishlists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="admin-wishlist">
      <h1>Admin Wishlist Management</h1>
      {wishlists.length === 0 && <p>No wishlists found.</p>}

      {wishlists.map(({ email, wish }) => (
        <div key={email} className="user-wishlist">
          <h3>User: {email}</h3>
          {wish.length === 0 ? (
            <p>No items in wishlist.</p>
          ) : (
            <div className="wishlist-grid">
              {wish.map((item, index) => (
                <div className="wishlist-card" key={`${email}-${item.productid}-${index}`}>
                  <img src={item.productimg} alt={item.productname} />
                  <div className="details">
                    <h4>{item.productname}</h4>
                    <p>Category ID: <strong>{item.categoryid}</strong></p>
                    <p className="price">₹{item.productprice}</p>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveWishItem(email, item.categoryid, item.productid)}
                  >
                    ❌ Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminWishlist;
