
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
      subject: "Welcome ZEPHYR",
      html: `
        <p>Hello  ${name}</p>
        <p>Thank you for Registering !!</p> <br>
      <p>Your Account has been created successfully<p> <br>
        <p>Best regards,</p>
        <p>ZEPHYR Team</p>
  
         <img src="https://img.freepik.com/premium-vector/online-clothing-store-app-web-shopping-customer-choosing-dress_81894-7153.jpg?w=740 " alt="">
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