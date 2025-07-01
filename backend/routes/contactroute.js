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
      subject: "Welcome For.everrnew",
      html: `
        <p>Hello ${name},</p>
        <p>Thank you for contacting us!</p>
        <p>We will get in touch with you soon.</p>
        <p>Best regards,<br>For.everrnew Team</p>
        <img src="https://img.freepik.com/premium-vector/online-clothing-store-app-web-shopping-customer-choosing-dress_81894-7153.jpg?w=740" alt="For.everrnew" />
      `,
    };

    const mailOptionsAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_ADMIN,
      subject: "New Contact Request - For.everrnew",
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
