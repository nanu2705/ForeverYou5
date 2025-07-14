// ReturnRefundPolicy.jsx
import React from 'react';
import './ReturnRefundPolicy.scss';
import { Helmet } from 'react-helmet-async';

const ReturnRefundPolicy = () => {
  return (
    <div className="return-policy">
      <Helmet>
        <title>Return & Refund Policy</title>
        <meta name="description" content="Return Policy page" />
      </Helmet>      
      <h1>Return & Refund Policy</h1>
      <p><strong>Foreveryou | Vadodara, Gujarat, India</strong></p>

      <h2>1. Eligibility for Return or Exchange</h2>
      <p>
        At Foreveryou, we strive to ensure your satisfaction. If you're not completely happy with your purchase, you may request a return or exchange within <strong>4 days</strong> of delivery. The item must be:
      </p>
      <ul>
        <li>Unused and in original condition</li>
        <li>With original packaging and tags intact</li>
        <li>Accompanied by the invoice or proof of purchase</li>
      </ul>

      <h2>2. Return Process</h2>
      <p>To initiate a return:</p>
      <ol>
        <li>Email us at <strong>foreveryou5contact@gmail.com</strong> with your order ID and reason for return.</li>
        <li>Attach a proper unboxing video as proof (mandatory).</li>
        <li>We will verify the request and send return instructions.</li>
      </ol>

      <h2>3. Non-Returnable Items</h2>
      <p>We do not accept returns or exchanges on:</p>
      <ul>
        <li>Items marked as Final Sale</li>
        <li>Used or damaged items (unless received that way)</li>
        <li>Customized or altered products</li>
        <li>Jewelry for hygiene reasons</li>
      </ul>

      <h2>4. Refund Policy</h2>
      <p>
        Once we receive your returned item and inspect it, a refund will be processed to your original method of payment within <strong>7–10 business days</strong>. Shipping charges (if any) are non-refundable.
      </p>
      <p>
        If you paid via UPI or other wallet services, please ensure your payment information is accurate for a smooth refund.
      </p>

      <h2>5. Damaged or Incorrect Items</h2>
      <p>
        If you receive a damaged or incorrect item, please contact us within 48 hours of delivery with unboxing video proof. We will arrange a replacement or refund at no extra cost to you.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        For any questions about returns, exchanges, or refunds, reach out to us at:<br />
        📧 Email:<a href='mailto:foreveryou5contact@gmail.com'> foreveryou5contact@gmail.com</a> <br />
        📍 Address: <a
      href="https://www.google.com/maps/search/?api=1&query=A-41+Balgopal+Society,+Near+Sai+Chokdi,+Manjalpur,+Vadodara+390011"
      target="_blank"
      rel="noopener noreferrer"
    >
      A-41 Balgopal Society, Near Sai Chokdi, Manjalpur, Vadodara 390011
    </a><br />

      </p>
    </div>
  );
};

export default ReturnRefundPolicy;
