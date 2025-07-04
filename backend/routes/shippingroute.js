

import express from 'express';
import jwt from 'jsonwebtoken';
import Register from '../models/Register.js';

const app = express();

// Update shipping info
app.post('/save-shipping-info', async (req, res) => {
  const { name, email, mobile, address, state, pincode, landmark, city } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success:false,error:'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({success:false,error: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({success:false,error: 'User not found' });

      user.shippingInfo = { name, mobile, email, address, state, pincode, landmark, city };
      await user.save();

      res.json({
        success: true,
        message: 'Thanks Shipping information saved successfully',
        shippingInfo: user.shippingInfo
      });
    });
  } catch (error) {
    console.error('Error saving shipping information:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get shipping info
app.get('/get-user-address', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ shippingInfo: user.shippingInfo });
    });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add to order from cart
app.post('/add-to-order', async (req, res) => {
  const { orderDate } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.cart.forEach(item => {
        user.order.push({
          orderDate,
          categoryid: item.categoryid,
          productid: item.productid,
          productimg: item.productimg,
          productname: item.productname,
          productprice: item.productprice,
          size: item.size,
          quantity: item.quantity,
        });
      });

      user.cart = [];
      await user.save();

      res.json({
        success: true,
        message: 'Thanks! Your Order has Been Confirmed',
        orderInfo: user.order,
        cartInfo: user.cart
      });
    });
  } catch (error) {
    console.error('Error adding to order:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get order history
app.get('/order', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ orderInfo: user.order });
    });
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Place order directly
app.post('/order', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const order = {
        user: user._id,
        paymentMode: req.body.paymentMode,
        total: req.body.total,
        orderDate: req.body.orderDate,
        status: req.body.status || 'Paid',
        products: req.body.products
      };

      user.order.push(order);
      user.cart = [];
      await user.save();

      // ✅ Send Email Confirmation
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nandanipatel057@gmail.com', // 🔁 Replace with your email
          pass: 'pnso qpbr gewh aqdo'     // 🔁 Use Gmail App Password
        }
      });

      const emailBody = `
        <h2>Thank you for your order at Foreveryou!</h2>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
        <p><strong>Payment Mode:</strong> ${order.paymentMode}</p>
        <p><strong>Total:</strong> ₹${order.total}</p>
        <h3>Ordered Products:</h3>
        <ul>
          ${order.products.map(p => `
            <li>${p.productname} (₹${p.productprice} x ${p.quantity})</li>
          `).join('')}
        </ul>
        <br/>
        <p>We will ship your products soon. Stay fashionable!<br/><strong>- Team Foreveryou</strong></p>
      `;

      await transporter.sendMail({
        from: 'Foreveryou <nandanipatel057@gmail.com>',
        to: user.email,
        subject: 'Order Confirmation - Foreveryou',
        html: emailBody
      });

      res.json({ success: true, message: 'Order placed and email sent successfully' });
    });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default app;
