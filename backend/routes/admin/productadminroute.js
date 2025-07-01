import express from 'express';
import path from 'path';
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


// ✅ EDIT product in category
app.put('/api/data/:category/:productId', upload.fields([
  { name: 'images', maxCount: 1 },
  { name: 'side_images', maxCount: 5 },
]), (req, res) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const categories = JSON.parse(rawData);

  const { category, productId } = req.params;
  const {
    name,
    price,
    oldprice,
    title,
    productbrand,
    description,
    review,
    tomorrow
  } = req.body;

  const sizes = JSON.parse(req.body.sizes_product || '[]');
  const mainImage = req.files['images']?.[0];
  const sideImages = req.files['side_images'] || [];

  const categoryIndex = categories.findIndex(cat => cat.category === category);
  if (categoryIndex === -1) return res.status(404).json({ error: 'Category not found' });

  const productIndex = categories[categoryIndex].products.findIndex(p => p.id == productId);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

  const product = categories[categoryIndex].products[productIndex];

  product.productname = name || product.productname;
  product.route_productname = name ? name.replace(/\s+/g, '-') : product.route_productname;
  product.productprice = Number(price || product.productprice);
  product.productoldprice = Number(oldprice || product.productoldprice);
  product.productbrand = productbrand || product.productbrand;
  product.description = description ? JSON.parse(description) : product.description;
  product.review = Number(review || product.review);
  product.tomorrow = tomorrow === "true" || tomorrow === true;
  product.sizes_product = sizes;

  if (mainImage) {
    product.productimg = "/uploads/" + mainImage.filename;
  }

  if (sideImages.length > 0) {
    product.side_image = sideImages.map(file => ({
      in_image: "/uploads/" + file.filename
    }));
  }

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf-8');
  res.status(200).json({ success: true, message: "Product updated" });
});


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


// ✅ DELETE entire category
app.delete('/api/data/category/:category', (req, res) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  let categories = JSON.parse(rawData);

  const categoryToDelete = decodeURIComponent(req.params.category);

  const filtered = categories.filter(c => c.category !== categoryToDelete);

  if (filtered.length === categories.length) {
    return res.status(404).json({ error: 'Category not found' });
  }

  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
  res.json({ success: true, message: 'Category deleted' });
});


export default app;
