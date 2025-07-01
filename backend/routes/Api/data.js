import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../data.json');

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ GET products (with full image URLs)
app.get('/api/data', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'File read error' });

    try {
      const jsonData = JSON.parse(data);

      const updatedJson = jsonData.map(item => {
        if (item.img) {
          item.img = `${req.protocol}://${req.get('host')}${item.img}`;
        }

        item.products = item.products.map(product => {
          if (product.productimg) {
            product.productimg = `${req.protocol}://${req.get('host')}${product.productimg}`;
          }
          if (product.side_image) {
            product.side_image = product.side_image.map(a => {
              if (a.in_image) {
                a.in_image = `${req.protocol}://${req.get('host')}${a.in_image}`;
              }
              return a;
            });
          }
          return product;
        });

        return item;
      });

      res.json({ success: true, data: updatedJson });
    } catch {
      res.status(500).json({ error: 'Parse error' });
    }
  });
});

// ✅ POST new product
app.post('/api/data', upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'side_images', maxCount: 3 },
  { name: 'category_img', maxCount: 1 }
]), (req, res) => {
  const {
    name, price, oldprice, category, productbrand, description,
    review, tomorrow, title
  } = req.body;

  const sizes = JSON.parse(req.body.sizes_product || '[]');
  const images = req.files['images'] || [];
  const sideImages = req.files['side_images'] || [];

  const product = {
    id: Date.now(),
    productimg: images.length > 0 ? "/uploads/" + images[0].filename : "",
    productbrand,
    productname: name,
    route_productname: name.replace(/\s+/g, '-'),
    productprice: Number(price),
    productoldprice: Number(oldprice),
    review: Number(review) || 0,
    tomorrow: tomorrow === "true" || tomorrow === true,
    description: JSON.parse(description || '[]'),
    side_image: sideImages.map(file => ({ in_image: "/uploads/" + file.filename })),
    sizes_product: sizes
  };

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const categories = JSON.parse(rawData);
  const categoryIndex = categories.findIndex(cat => cat.category === category);
  const categoryImageFile = req.files['category_img']?.[0];

  if (categoryIndex !== -1) {
    if (categoryImageFile) {
      categories[categoryIndex].img = "/uploads/" + categoryImageFile.filename;
    }
    if (!categories[categoryIndex].title && title) {
      categories[categoryIndex].title = title;
    }
    categories[categoryIndex].products.push(product);
  } else {
    const newCategory = {
      id: Date.now(),
      title: title || "",
      category: category,
      route_category: category.replace(/\s+/g, '-'),
      img: categoryImageFile ? "/uploads/" + categoryImageFile.filename : null,
      products: [product]
    };
    categories.push(newCategory);
  }

  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf-8');
  res.status(200).json({ success: true, message: "Product added" });
});

export default app;
