

import express from 'express';
import jwt from 'jsonwebtoken';
import Register from '../models/Register.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';



dotenv.config();

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

// // Get order history for admin
// app.get('/admin/orders', async (req, res) => {
//   try {
//     const users = await Register.find(
//       { order: { $exists: true, $ne: [] } },
//       { name: 1, email: 1, order: 1 }
//     );

//     res.json({ success: true, users });

//     console.log(users)
//   } catch (error) {
//     console.error('Error fetching all orders:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });

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
        products: req.body.products,
        shippingInfo: req.body.shippingInfo,
      };

      user.order.push(order);
      user.cart = [];
      await user.save();

      // ✅ Send Email Confirmation
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // 🔁 Replace with your email
          pass: process.env.EMAIL_PASS    // 🔁 Use Gmail App Password
        }
      });

     const emailBody = `
  <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
  <img src="https://i.ibb.co/XZFHjm7S/logo.png" alt="Foreveryou Logo" style="max-width: 150px; display: block; margin: auto;" />
    <h2 style="color: #D72638; text-align: center;">Thank you for shopping with <span style="color: #000;">Foreveryou</span>!</h2>

    <p>Hi ${user.name},</p>
    <p>We’ve received your order and it's being processed. Below are your order details:</p>

    <h3 style="color: #444;">🧾 Order Summary</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td><strong>Order Date:</strong></td><td>${new Date(order.orderDate).toLocaleString()}</td></tr>
      <tr><td><strong>Payment Mode:</strong></td><td>${order.paymentMode}</td></tr>
      <tr><td><strong>Total Amount:</strong></td><td>₹${order.total}</td></tr>
      <tr><td><strong>Status:</strong></td><td>${order.status}</td></tr>
    </table>

    ${order.shippingInfo ? `
      <h3 style="color: #444;">📦 Shipping Address</h3>
      <p>
        ${order.shippingInfo.name}<br/>
        ${order.shippingInfo.address},<br/>
        ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}<br/>
        Mobile: ${order.shippingInfo.mobile}
      </p>
    ` : ''}

    <h3 style="color: #444;">🛍️ Products Ordered</h3>
    <ul style="list-style: none; padding: 0;">
      ${order.products.map(p => `
        <li style="margin-bottom: 10px; border-bottom: 1px dashed #ccc; padding-bottom: 10px;">
          <strong>${p.productname}</strong><br/>
          Price: ₹${p.productprice} <br/>
          Quantity: ${p.quantity} <br/>
          Size: ${p.size}
        </li>
      `).join('')}
    </ul>

    <p style="margin-top: 20px;">We’ll notify you once your order is shipped. If you have any questions, just reply to this email.</p>

    <p style="color: #888; font-size: 14px;">This is an automated message from <strong>Foreveryou</strong>. Please do not reply directly to this email.</p>

    <p style="margin-top: 30px;">Stay stylish,<br/><strong>Team Foreveryou</strong></p>
  </div>
`;


      await transporter.sendMail({
        from: process.env.EMAIL_USER ,
        to: user.email,
        subject: 'Order Confirmation - Foreveryou',
        html: emailBody
      });

      // ✅ Send Email to Admin as well
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'foreveryou5contact@gmail.com', // ✅ Admin Email
  subject: `New Order Received - ₹${order.total} by ${user.name}`,
  html: `
    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #D72638;">New Order Received on Foreveryou</h2>
      <p><strong>Customer Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Payment Mode:</strong> ${order.paymentMode}</p>

      ${order.shippingInfo ? `
        <h3>Shipping Info:</h3>
        <p>
          ${order.shippingInfo.name}<br/>
          ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pincode}<br/>
          Landmark: ${order.shippingInfo.landmark}<br/>
          Mobile: ${order.shippingInfo.mobile}, Email: ${order.shippingInfo.email}
        </p>
      ` : ''}

      <h3>Ordered Products:</h3>
      <ul style="padding-left: 20px;">
        ${order.products.map(p => `
          <li>
            <strong>${p.productname}</strong><br/>
            Price: ₹${p.productprice}, Quantity: ${p.quantity}, Size: ${p.size}
          </li>
        `).join('')}
      </ul>
    </div>
  `
});

      res.json({ success: true, message: 'Order placed and email sent successfully' });
    });
  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default app;
