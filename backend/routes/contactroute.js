import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/Contact.js';

dotenv.config();

const app = express();

app.post('/contact', async (req, res) => {
  const { name, email, mobile, message } = req.body;

  if (!name || !email || !mobile || !message) {
    return res.json({ go: 'alert', error: 'All fields are required.' });
  }

  try {
    const repeat = await User.findOne({ email, mobile });
    if (repeat) {
      return res.json({ go: 'alert', error: 'You have already contacted us!' });
    }

    const result = await User.create({ name, email, mobile, message });
    console.log('Contact saved:', result);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptionsUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🌸 Thank you for contacting Foreveryou!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fafafa; border: 1px solid #eee;">
      <h2 style="color: #d63384;">Hi ${name},</h2>

      <p>Thank you for reaching out to <strong>Foreveryou</strong>. We've received your message and our support team will get back to you as soon as possible.</p>

      <p><strong>Here’s a summary of your message:</strong></p>
      <div style="background-color: #fff; padding: 15px; border-left: 4px solid #d63384; margin: 10px 0;">
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Your Message:</strong></p>
        <p>${message}</p>
      </div>

      <p style="margin-top: 20px;">In the meantime, feel free to explore our latest styles at <a href="https://foreveryou.in" style="color: #d63384;">foreveryou.in</a>.</p>

      <p>With love,<br/>The Foreveryou Team 💖</p>

      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #888;">This is an automated response. Our team will personally reply to your query shortly.</p>
    </div>
      `,
    };

    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_ADMIN,
      subject: "New Contact Request - ForeverYou",
      html: `
        <h3>New Contact Submission:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptionsUser);
    await transporter.sendMail(mailOptionsAdmin);

    res.status(200).json({ go: 'success', message: 'Thanks For Contacting Us' });

  } catch (error) {
    console.error('Error in contact API:', error);
    res.json({ go: 'alert', error: 'Contact cannot be submitted' });
  }
});

export default app;
