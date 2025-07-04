import React, { useContext } from 'react';
import MyContext from '../Context/MyContext';
import './Payment.scss';
import LoginError from '../Profile/LoginError/LoginError';
import axios from 'axios';

const Payment = () => {
  const {
    loadingin,
    token,
    TotalValue,
    apiUrl,
    cart,
    setCart,
  } = useContext(MyContext);

  const handleMockPayment = async () => {
    const shipping = JSON.parse(sessionStorage.getItem("shipping"));

    if (!shipping || !shipping.address) {
      alert("Shipping address missing. Please add it before payment.");
      return;
    }

    const orderDetails = {
      paymentMode: "Online Payment",
      total: TotalValue,
      orderDate: new Date().toISOString(),
      status: "Paid",
      shippingInfo: shipping,
      products: cart,
    };

    try {
      const { data } = await axios.post(`${apiUrl}/order`, orderDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
  setCart([]);
  sessionStorage.removeItem("cart");
  alert("Order placed! Details have been emailed to your registered email address.");
} else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Payment failed:", error.response?.data || error.message);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <>
      {token ? (
        <div className="pay_one">
          <h1>Payment</h1>
          <p>Total Price: ₹{TotalValue}</p>

          <div className="select">
            <div className="first">
              <label>
                <input type="radio" name="payment" checked readOnly />
                Pay Online
              </label>
              <div className="upi">
                <button
                  onClick={handleMockPayment}
                  disabled={loadingin}
                >
                  {loadingin ? "Processing..." : "Proceed to Pay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoginError title="Payment information" />
      )}
    </>
  );
};

export default Payment;
