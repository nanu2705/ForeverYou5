
import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import Register from '../models/Register.js';

dotenv.config();
const app = express();


 //save register data

app.post('/register', async (req, res) => {
  const { name,email,mobile,password } = req.body;
  console.log(name+email+mobile+password);
  try {
  // Check if user already exists
  const existingUser = await Register.findOne({ email });

  if(existingUser){
    return res.json({go:'alert',registererror:'email alredy exist'})
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const resultregister = await Register.create({
      name,
      email,
      mobile,
      password:hashedPassword,
      
      });
  
      console.log(resultregister)
  
  
       // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  
    const mailOptions2 = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🌟 Welcome to Foreveryou – As Different As You!",
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background-color: #fefefe; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #d63384;">Hi ${name || 'there'}, welcome to Foreveryou!</h2>

      <p>Thank you for registering with <strong>Foreveryou</strong> — your new go-to destination for inclusive, affordable, and expressive fashion.</p>

      <p>We’re thrilled to have you as part of our growing community. Here’s what you can start doing right away:</p>

      <ul style="line-height: 1.8;">
        <li>✨ Explore handpicked clothing and jewelry collections</li>
        <li>💖 Save items to your wishlist</li>
        <li>🛒 Enjoy a smooth shopping and checkout experience</li>
      </ul>

      <a href="https://foreveryou.in" 
         style="display: inline-block; margin-top: 20px; background-color: #d63384; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
        Start Shopping
      </a>

      <p style="margin-top: 30px;">
        If you ever need help, questions, or styling tips, feel free to <a href="https://foreveryou.in/contact" style="color: #d63384;">reach out</a>.
      </p>

      <p>Warm regards,<br/>🛍️ Team Foreveryou</p>

      
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ddd;" />

      <p style="font-size: 12px; color: #888;">
        You're receiving this email because you created an account at <strong>Foreveryou</strong>.
        If this wasn't you, please <a href="https://foreveryou.in/contact" style="color: #d63384;">contact support</a>.
      </p>
    </div>
      `,
    };
  
    const info2 = await transporter.sendMail(mailOptions2);
   
    console.log("Email sent:", info2.response);

  
  
      res.json({go:'success',registermessage:'Thanks For Registering'});
    } catch (error) {
      res.json({ go:'alert', registererror: 'register details cannot be submitted' });
    }
})


// retrive register data
    app.get('/register-info',async(req,res) =>{
  
  
      const Registerdata = await Register.find()
         
          res.json({data:Registerdata})
      
          
      })


 // login process
        app.post('/login', (req, res) => {
          const { email, password } = req.body;
        
          Register.findOne({ email })
            .then(existingUser => {
              if (!existingUser) {
                return res.json({ go: 'alert', loginerror: 'email is wrong' });
              }
        
              return bcrypt.compare(password, existingUser.password)
                .then(passwordMatch => {
                  if (!passwordMatch) {
                    return res.json({ go: 'alert', loginerror: 'password is wrong' });
                  }
        
                  const token = jwt.sign({ email }, 'secret-key', { expiresIn: '24h' });
        
                  console.log(token);

                  const accountInfo = {
                    name: existingUser.name,
                    email: existingUser.email, 
                    mobile: existingUser.mobile,
             
                  };
        
                  res.json({ go: 'success', loginmessage: 'Thanks For Login', data: token,accountInfo:accountInfo,cartInfo:existingUser.cart,wishInfo:existingUser.wish,shippingInfo:existingUser.shippingInfo,orderInfo:existingUser.order });
                });
            })
            .catch(error => {
              res.json({ go: 'alert', loginerror: 'Login details cannot be submitted' });
            });
        });
//Register Over

 // Admin get account data
app.get('/account-details', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ merror: 'Invalid token' });
      }

      const user = await Register.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const accountInfo = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      };

      res.json({ accountInfo:accountInfo });
    });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// ACCOUNT INFORMATION UPDATE 

app.post('/update-account-data', async (req, res) => {
  const { name,email,mobile,password } = req.body;


  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({success: false,  error: 'Token not provided' });
    }

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({success: false, error: 'Invalid token' });
      }

      const user = await Register.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({success: false, error: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
        user.name = name;
      user.email = email;
      user.mobile = mobile;
      user.password=hashedPassword
    await user.save();



    const accountInfo = {
    
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      
    };
   

    res.json({ success: true, message: 'Thanks Your Information has Been Updated' ,accountInfo:accountInfo});  
    
    });
  } catch (error) {
    console.error('Error fetching user address:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
   
       });

    
     

export default app;