// server.js or index.js

import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import schedule from 'node-schedule';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
// import Razorpay from 'razorpay'; 

import { fileURLToPath } from 'url';


import topCategory from './routes/topCategory.js';
import topCategoryAdmin from './routes/admin/topCategoryAdmin.js';
import category from "./routes/Api/category.js";
import data from "./routes/Api/data.js";
import topCategoryView from "./routes/Api/topCategoryView.js";
import promoroute from "./routes/promoroute.js";
import promoadminroute from "./routes/admin/promoadminroute.js"
import productadminroute from "./routes/admin/productadminroute.js";
import newsletterroute from "./routes/newsletterroute.js";
import newsadminroute from "./routes/admin/newsadminroute.js"
import contactadminroute from "./routes/admin/contactadminroute.js";
import contactroute from "./routes/contactroute.js";
import registerroute from "./routes/registerroute.js";
import cartroute from "./routes/cartroute.js";
import wishlistroute from "./routes/wishlistroute.js";
import shippingroute from "./routes/shippingroute.js";
import sliderroute from "./routes/sliderroute.js";



// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Multer setup

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });



// App initialization
const app = express();
dotenv.config();

// ✅ Make /uploads accessible via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
  origin: 'https://your-frontend-domain.com', // your Hostinger domain
  credentials: true, // if you use cookies or auth headers
}));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// mongoose connection
mongoose.connect('mongodb+srv://nandanipatel057:qPrLJ7hONnX9DfYW@cluster0.v2nbfxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log("mongodb connected"))



// API routes
app.use('/', topCategory);
app.use('/', topCategoryAdmin);
app.use('/ ', category);
app.use('/', data);
app.use('/', topCategoryView);
app.use('/', promoroute);
app.use('/', promoadminroute);
app.use('/', productadminroute);
app.use('/', newsletterroute);
app.use('/', newsadminroute);
app.use('/', contactadminroute);
app.use('/', contactroute);
app.use('/', registerroute);
app.use('/', cartroute);
app.use('/', wishlistroute);
app.use('/', shippingroute);
app.use('/', sliderroute);




// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });




// for payment post
// app.post("/razorpay", async (req, res) => {
//   const { amount } = req.body;

//   const options = {
//     amount: amount * 100, // Convert amount to smallest currency unit (e.g., paise for INR)
//     currency: 'INR',
//     receipt: "receipt#1",
//     payment_capture: '1'
//   };

//   try {
//     const response = await razorpay.orders.create(options);
//     console.log(response)
//     res.json({
//       success: true,
//       id: response.id,
//       currency: response.currency
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Please try again' });
//   }
// });


   


//Schedule Email

// schedule.scheduleJob('* * 27 12 2 ', async () => {

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//   user: process.env.EMAIL_USER ,
//   pass:  process.env.EMAIL_PASS,
//     },
//   });
  
//   const mailOptions = {
//     from:process.env.EMAIL_USER,
//     to: 'nandanip283@gmail.com',
//     subject: 'BIRTHDAY OFFER',
//     html:` <p>Hello </p>
//     <p>Wishing you a very Happy Birthday!!</p> <br>
//     <p> Thanks for connecting with us for so long .
//          ZEPHYR provides you a Birthday Special Offer on your very ospicious day .</p>  <br>
//     <p>Discount on Every Product till midnight 12.</p>
//     <p>Enjoy your day with ZEPHYR</p>

//     <img src="https://img.freepik.com/premium-vector/online-clothing-store-app-web-shopping-customer-choosing-dress_81894-7153.jpg?w=740 " alt="">
//   `,
//   };
  
  
    
//   const info = await transporter.sendMail(mailOptions);
//   console.log('Email sent:', info.response);
//   console.log('birthday email sent successfully');
    
//   }
  
     
//   )
//Schedule Email over






// WARNING: This will delete ALL users. Use carefully.
app.delete('/admin/delete-all-users', async (req, res) => {
  try {
    await Register.deleteMany({});
    res.status(200).json({ success: true, message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(3034, () => {
console.log("server connected")
})