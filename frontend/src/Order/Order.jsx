import React, { useEffect, useState } from 'react';
import './Order.scss';

const Order = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = sessionStorage.getItem("orderHistory");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  if (!orders.length) {
    return <div className="order-page"><h2>No orders found</h2></div>;
  }

  return (
    <div className="order-page">
      <h2>Your Order History</h2>
      {orders.map((order, index) => (
        <div key={index} className="single-order">
          <div className="order-info">
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
          </div>

          <div className="order-products">
            <h3>Items in this Order:</h3>
            <ul>
              {(order.products || order.product || []).map((product, idx) => (
                <li key={idx} className="order-product">
                  <img src={product.productimg} alt={product.productname} />
                  <div className="product-details">
                    <p className="name"><strong>{product.productname}</strong></p>
                    <p>Qty: {product.quantity || 1}</p>
                    {product.size && <p>Size: {product.size}</p>}
                    <p>Price: ₹{product.productprice}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <p><strong>Subtotal:</strong> ₹{order.total}</p>
            <p><strong>Delivery Charges:</strong> ₹0</p>
            <p className="total"><strong>Total Paid:</strong> ₹{order.total}</p>
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default Order;
