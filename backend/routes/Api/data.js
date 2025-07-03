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

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


// ✅ GET products (with full image/video URLs)
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

          if (product.side_images) {
            product.side_images = product.side_images.map(img =>
              `${req.protocol}://${req.get('host')}${img}`
            );
          }

          if (product.video) {
            product.video = `${req.protocol}://${req.get('host')}${product.video}`;
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

// ✅ POST new product (with side images + video)
app.post(
  '/api/data',
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'side_images', maxCount: 4 },
    { name: 'category_img', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  (req, res) => {
    try {
      const {
        name, price, oldprice, category, productbrand,
        description, review, tomorrow, title
      } = req.body;

      const sizes = JSON.parse(req.body.sizes_product || '[]');
      const descriptionArr = JSON.parse(description || '[]');
      const images = req.files['images'] || [];
      const sideImages = req.files['side_images'] || [];
      const categoryImage = req.files['category_img']?.[0];
      const videoFile = req.files['video']?.[0];

      const product = {
        id: Date.now(),
        productimg: images[0] ? "/uploads/" + images[0].filename : "",
        productbrand,
        productname: name,
        route_productname: name.replace(/\s+/g, '-'),
        productprice: Number(price),
        productoldprice: Number(oldprice),
        review: Number(review) || 0,
        tomorrow: tomorrow === "true" || tomorrow === true,
        description: descriptionArr,
        side_images: sideImages.map(file => "/uploads/" + file.filename),
        video: videoFile ? "/uploads/" + videoFile.filename : null,
        sizes_product: sizes
      };

      const rawData = fs.readFileSync(filePath, 'utf-8');
      const categories = JSON.parse(rawData);
      const categoryIndex = categories.findIndex(cat => cat.category === category);

      if (categoryIndex !== -1) {
        if (categoryImage) {
          categories[categoryIndex].img = "/uploads/" + categoryImage.filename;
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
          img: categoryImage ? "/uploads/" + categoryImage.filename : null,
          products: [product]
        };
        categories.push(newCategory);
      }

      fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), 'utf-8');
      res.status(200).json({ success: true, message: "✅ Product added successfully" });

    } catch (err) {
      console.error("❌ Error in POST /api/data:", err);
      res.status(500).json({ success: false, error: 'Server error while adding product' });
    }
  }
);

export default app;
