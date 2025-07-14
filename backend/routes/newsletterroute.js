import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import News from '../models/Newsletter.js';
import Register from '../models/Register.js';

dotenv.config();

const app = express();

// ✅ Newsletter subscription route
app.post('/newlater', async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await News.findOne({ email });
    const existingRegister = await Register.findOne({ email });

    if (existingUser || existingRegister) {
      return res.json({ success: false, error: 'You are already a Subscriber!!' });
    }

    const result = await News.create({ email });
    console.log(result);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `📰 You're subscribed to Foreveryou!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fefefe; border: 1px solid #eee;">
      <h2 style="color: #d63384;">Welcome to Foreveryou,  'Fashion Lover'! 🛍️</h2>

      <p>Thank you for subscribing to the <strong>Foreveryou</strong> newsletter.</p>

      <p>You're now officially part of our fashion-forward family. We'll keep you updated with:</p>
      <ul style="line-height: 1.6;">
        <li>✨ New arrivals</li>
        <li>💸 Exclusive subscriber-only offers</li>
        <li>🎉 Early access to sales and collections</li>
        <li>💡 Styling tips, seasonal trends & more</li>
      </ul>

      <p>In the meantime, explore our latest collections at <a href="https://foreveryou.in" style="color: #d63384;">foreveryou.in</a>.</p>

      <p style="margin-top: 20px;">As Different As You.<br/>— The Foreveryou Team ♾️</p>

      <hr style="margin: 30px 0;" />
      <p style="font-size: 12px; color: #999;">You’re receiving this email because you signed up for our newsletter.</p>
    </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.json({ success: true, message: 'Thanks for subscribing!' });
  } catch (error) {
    console.error('Error during subscription:', error);
    res.json({ success: false, error: 'Internal Server Error' });
  }
});


export default app;
