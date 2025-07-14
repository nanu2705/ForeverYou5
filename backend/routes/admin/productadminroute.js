import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../data.json');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });


// ✅ DELETE product from category
app.delete('/api/data/:category/:productId', (req, res) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const categories = JSON.parse(rawData);

  const { category, productId } = req.params;

  const categoryIndex = categories.findIndex(cat => cat.category === category);
  if (categoryIndex === -1) return res.status(404).json({ error: 'Category not found' });

  const productIndex = categories[categoryIndex].products.findIndex(p => p.id == productId);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

  categories[categoryIndex].products.splice(productIndex, 1);

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf-8');
  res.json({ success: true, message: 'Product deleted' });
});

// ✅ EDIT product in category
app.put('/api/data/:category/:productId', upload.single('productimg'), (req, res) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const categories = JSON.parse(rawData);

  const { category, productId } = req.params;

  const categoryIndex = categories.findIndex(cat => cat.category === category);
  if (categoryIndex === -1) return res.status(404).json({ error: 'Category not found' });

  const productIndex = categories[categoryIndex].products.findIndex(p => p.id == productId);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

  const existingProduct = categories[categoryIndex].products[productIndex];

  // ✅ Update fields
  const updatedFields = req.body;
  const updatedProduct = {
    ...existingProduct,
    ...updatedFields
  };

  // ✅ If new image uploaded, update and optionally delete old image
  if (req.file) {
    const oldImg = existingProduct.productimg;
    updatedProduct.productimg = `/uploads/${req.file.filename}`;
    if (oldImg && fs.existsSync(path.join(__dirname, '../../', oldImg))) {
      fs.unlink(path.join(__dirname, '../../', oldImg), (err) => {
        if (err) console.error('Failed to delete old image:', err);
      });
    }
  }

  // ✅ Save updated product
  categories[categoryIndex].products[productIndex] = updatedProduct;

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf-8');
  res.json({ success: true, message: 'Product updated', data: updatedProduct });
});


export default app;
