// routes/wishlistRoute.js
import express from 'express';
import jwt from 'jsonwebtoken';
import Register from '../models/Register.js';

const app = express();

// ✅ Add to Wishlist
app.post('/add-to-wish', async (req, res) => {
  const { categoryid, productid, productimg, productname, productprice, productbrand } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ success: false, error: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      const existingProduct = user.wish.find(
        item => item.categoryid === categoryid && item.productid === productid
      );
      if (existingProduct) return res.json({ success: false, error: 'Product already in wishlist' });

      user.wish.push({ categoryid, productid, productimg, productname, productprice, productbrand});
      await user.save();
      res.json({ success: true, message: 'Thanks Product added to wishlist', wishInfo: user.wish });
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ✅ Get Wishlist
app.get('/wish', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ wishInfo: user.wish });
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Remove from Wishlist (User)
app.post('/remove-from-wish', async (req, res) => {
  const { categoryid, productid } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOneAndUpdate(
        { email: decoded.email },
        { $pull: { wish: { categoryid, productid } } },
        { new: true }
      );

      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ success: true, message: 'Product removed from wishlist', wishInfo: user.wish });
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ✅ Admin: Get All Wishlists
app.get('/api/admin/wishlists', async (req, res) => {
  try {
    const users = await Register.find({}, 'email wish');
    const wishlists = users.map(user => ({
      email: user.email,
      wish: user.wish,
    }));
    res.json({ success: true, data: wishlists });
  } catch (error) {
    console.error('Error fetching wishlists for admin:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ✅ Admin: Remove Wishlist Item
app.delete('/api/admin/wishlist/:email/:categoryid/:productid', async (req, res) => {
  const { email, categoryid, productid } = req.params;
  try {
    const user = await Register.findOneAndUpdate(
      { email },
      { $pull: { wish: { categoryid, productid } } },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Wishlist item removed', wish: user.wish });
  } catch (error) {
    console.error('Admin error removing from wishlist:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default app;