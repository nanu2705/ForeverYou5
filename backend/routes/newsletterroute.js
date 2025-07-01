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
      subject: 'Thank You For Subscribing!',
      html: `
        <p>Thank you for subscribing with For.everrnew. We are excited to have you on board!</p>
        <p>Best regards,<br/>For.evernew Team</p>
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
