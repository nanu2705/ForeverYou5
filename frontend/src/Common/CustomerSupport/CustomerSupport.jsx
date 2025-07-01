import React from 'react';
import './CustomerSupport.scss';
import supportImg from '../../Images/slider1.jpg';

const CustomerSupport = () => {
  return (
    <div className="customer-support">
      <div className="support-hero">
        <img src={supportImg} alt="Customer Support" />
        <div className="overlay">
          <h1>We're Here to Help</h1>
          <p>Your satisfaction is our top priority. Reach out to us anytime!</p>
        </div>
      </div>

      <div className="support-content">
        <section>
          <h2>Contact Us</h2>
          <p>Have a question or issue? Get in touch with our support team via:</p>
          <ul>
            <li><strong>Email:</strong> support@for.everrnew.com</li>
            <li><strong>Phone:</strong> +91-98765-43210 (Mon-Sat, 10am - 6pm)</li>
            <li><strong>Live Chat:</strong> Available on website (Mon-Sat, 10am - 6pm)</li>
          </ul>
        </section>

        <section>
          <h2>Order & Delivery Support</h2>
          <p>Track your orders, update delivery addresses, and get delivery estimates. Facing delays? We’ll resolve it quickly!</p>
        </section>

        <section>
          <h2>Returns & Refunds</h2>
          <p>Easy 7-day return policy. If you're not satisfied, request a return or exchange directly from your account dashboard.</p>
        </section>

        <section>
          <h2>FAQs</h2>
          <ul>
            <li><strong>When will I get my refund?</strong> Within 5-7 business days after return is picked up.</li>
            <li><strong>Can I cancel my order?</strong> Yes, within 12 hours of placing it or before it’s shipped.</li>
            <li><strong>Do you offer international shipping?</strong> Currently, we only ship within India.</li>
          </ul>
        </section>

        <section>
          <h2>Need More Help?</h2>
          <p>Feel free to <a href="/contact">contact us</a> or connect via our social media channels.</p>
        </section>
      </div>
    </div>
  );
};

export default CustomerSupport;
