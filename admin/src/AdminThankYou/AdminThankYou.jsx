import React, { useState, useContext } from 'react';
import axios from 'axios';
import MyContext from '../Context/MyContext';
import './AdminThankYou.scss';

const AdminThankYou = () => {
  const { apiUrl } = useContext(MyContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('Thank you for your recent order! We appreciate your support.');
  const [response, setResponse] = useState('');

  const handleSend = async () => {
    if (!email || !name || !message) {
      setResponse('Please fill all required fields.');
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/api/admin/send-thankyou`, {
        email, name, orderId, message,
      });

      if (res.data.success) {
        setResponse('✅ Email sent successfully!');
        setEmail('');
        setName('');
        setOrderId('');
      } else {
        setResponse('❌ Failed to send email.');
      }
    } catch (error) {
      setResponse('❌ Error occurred while sending.');
      console.error(error);
    }
  };

  return (
    <div className="admin-thankyou">
      <h2>Send Thank-You Email</h2>
      <input
        type="text"
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Customer Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Order ID (optional)"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <textarea
        placeholder="Message"
        rows="5"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}>Send Email</button>
      {response && <p>{response}</p>}
    </div>
  );
};

export default AdminThankYou;
