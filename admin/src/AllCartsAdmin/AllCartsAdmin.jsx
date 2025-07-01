import React, { useContext, useEffect} from "react";
import "./AllCartsAdmin.scss";
import MyContext from "../Context/MyContext";

const AllCartsAdmin = () => {

  const {allCarts,loading,fetchAllCarts,handleDeleteCartItem} =useContext(MyContext)
 

  useEffect(() => {
    fetchAllCarts();
  },);

 

  if (loading) return <p>Loading all carts...</p>;

  return (
    <div className="admin-cart-container">
      <h2>🛒 All Users' Cart Details</h2>
      {allCarts.length === 0 ? (
        <p>No carts found.</p>
      ) : (
        allCarts.map((user, idx) => (
          <div className="user-cart" key={idx}>
            <h3>{user.name} ({user.email})</h3>
            <div className="cart-items">
              {user.cart.length === 0 ? (
                <p style={{ fontStyle: "italic", color: "gray" }}>Cart is empty</p>
              ) : (
                user.cart.map((item, index) => (
                  <div className="cart-item" key={index}>
                    <img src={item.productimg} alt={item.productname} />
                    <div className="details">
                      <p><strong>Name:</strong> {item.productname}</p>
                      <p><strong>Price:</strong> ₹{item.productprice}</p>
                      <p><strong>Size:</strong> {item.size}</p>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteCartItem(user.email, item.categoryid, item.productid, item.size)}
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AllCartsAdmin;
