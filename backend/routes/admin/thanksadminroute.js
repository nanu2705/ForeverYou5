import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.post('/api/admin/send-thankyou', async (req, res) => {
  try {
    const { email, name, orderId, message } = req.body;

    // ✅ Validate required fields
    if (!email || !name || !message) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // ✅ Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your Gmail or business email
        pass: process.env.EMAIL_PASS, // Gmail App Password (not account password)
      },
    });

    // ✅ Email content
    const mailOptions = {
      from: `Foreveryou <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank You for Your Order - Foreveryou`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; background-color: #fdfdfd; max-width: 600px; margin: auto;">
          <img src="https://i.ibb.co/XZFHjm7S/logo.png" alt="Foreveryou Logo" style="max-width: 150px; display: block; margin: 0 auto 20px;" />
          <h2 style="color: #D72638; text-align: center;">Hi ${name},</h2>
          <p style="font-size: 16px;">${message}</p>
          ${orderId ? `<p style="font-size: 15px;"><strong>Order ID:</strong> ${orderId}</p>` : ''}
          <p style="font-size: 15px;">We truly appreciate your trust in <strong>Foreveryou</strong>.</p>
          <br/>
          <p style="font-size: 15px;">Warm regards,<br/><strong>Team Foreveryou</strong></p>
          <hr style="margin-top: 20px;"/>
          <p style="font-size: 12px; color: #888;">This is an automated email. Please do not reply to this message.</p>
        </div>
      `,
    };

    // ✅ Send the email
    await transporter.sendMail(mailOptions);

    // ✅ Respond to frontend
    res.json({ success: true, message: 'Thank-you email sent successfully!' });

  } catch (error) {
    console.error('Admin Thank-You Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});

export default app;