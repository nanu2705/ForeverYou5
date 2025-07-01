import express from 'express';
import jwt from 'jsonwebtoken';
import Register from '../models/Register.js'; 

const app = express();

// Add to cart
app.post('/add-to-cart', async (req, res) => {
  const { categoryid, productid, productimg, productname, productprice, size } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ success: false, error: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      const existingProduct = user.cart.find(
        item => item.categoryid === categoryid && item.productid === productid && item.size === size
      );
      if (existingProduct) return res.json({ success: false, error: 'Product with same size already in cart' });

      user.cart.push({ categoryid, productid, productimg, productname, productprice, size });
      await user.save();
      res.json({ success: true, message: 'Thanks Product added to cart', cartInfo: user.cart });
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get cart
app.get('/cart', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ success: false, message: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      res.json({ cartInfo: user.cart });
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Remove from cart
app.post('/remove-from-cart', async (req, res) => {
  const { categoryid, productid, size } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOneAndUpdate(
        { email: decoded.email },
        { $pull: { cart: { categoryid, productid, size } } },
        { new: true }
      );
      if (!user) return res.status(404).json({ message: 'User not found' });

      res.json({ success: true, message: 'Product removed from cart', cartInfo: user.cart });
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Increase quantity
app.post('/increase-quantity', async (req, res) => {
  const { categoryid, productid, size } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const product = user.cart.find(p => p.categoryid === categoryid && p.productid === productid && p.size === size);
      if (product) {
        if (product.quantity < 10) {
          product.quantity++;
        } else return res.json({ success: false, error: 'Maximum quantity is 10' });
      } else return res.json({ success: false, error: 'Product not found in cart' });

      await user.save();
      res.json({ success: true, message: 'Quantity increased', cartInfo: user.cart });
    });
  } catch (error) {
    console.error('Increase quantity error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Decrease quantity
app.post('/decrease-quantity', async (req, res) => {
  const { categoryid, productid, size } = req.body;
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, 'secret-key', async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid token' });

      const user = await Register.findOne({ email: decoded.email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const product = user.cart.find(p => p.categoryid === categoryid && p.productid === productid && p.size === size);
      if (product) {
        if (product.quantity > 1) {
          product.quantity--;
        } else return res.json({ success: false, error: 'Minimum quantity is 1' });
      } else return res.json({ success: false, error: 'Product not found in cart' });

      await user.save();
      res.json({ success: true, message: 'Quantity decreased', cartInfo: user.cart });
    });
  } catch (error) {
    console.error('Decrease quantity error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

     // admin get all carts
      app.get('/admin/all-carts', async (req, res) => {
  try {
    const users = await Register.find({}, 'name email cart'); // get only needed fields

    const cartData = users
      .filter(user => user.cart && user.cart.length > 0)
      .map(user => ({
        name: user.name,
        email: user.email,
        cart: user.cart,
      }));

    res.json({ success: true, data: cartData });
  } catch (error) {
    console.error('Error fetching all carts:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

      //admin DELETE a specific item from a specific user's cart 
app.delete('/admin/cart/:email/:categoryid/:productid/:size', async (req, res) => {
  const { email, categoryid, productid, size } = req.params;

  try {
    const user = await Register.findOneAndUpdate(
      { email },
      { $pull: { cart: { categoryid, productid, size } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'Product removed from cart', cart: user.cart });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default app;
