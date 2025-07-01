import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categoryJsonPath = path.join(__dirname, '../category.json');


// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


// ✅ GET all top categories (for frontend display)

app.get('/api/top-categories', (req, res) => {
  fs.readFile(categoryJsonPath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Failed to read top categories:', err);
      return res.status(500).json({ error: 'Read error' });
    }

    try {
      const jsonData = JSON.parse(data);
      const updated = jsonData.map(cat => ({
        ...cat,
        img: cat.img ? `${req.protocol}://${req.get('host')}${cat.img}` : '',
      }));

      res.status(200).json(updated);
    } catch (e) {
      console.error('Failed to parse category.json:', e);
      res.status(500).json({ error: 'Parse error' });
    }
  });
});


// ✅ POST new top category (with image and categories[])

app.post('/api/top-categories', upload.single('image'), (req, res) => {
  try {
    const { title, categories } = req.body;
    const parsedCategories = JSON.parse(categories || '[]');
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newCategory = {
      id: Date.now(),
      title,
      categories: parsedCategories,
      img: imagePath
    };

    fs.readFile(categoryJsonPath, 'utf8', (err, data) => {
      let topCategories = [];
      if (!err && data) {
        try {
          topCategories = JSON.parse(data);
          if (!Array.isArray(topCategories)) topCategories = [];
        } catch (parseErr) {
          console.error('JSON parse error:', parseErr);
          return res.status(500).json({ error: 'Invalid JSON format' });
        }
      }

      topCategories.push(newCategory);

      fs.writeFile(categoryJsonPath, JSON.stringify(topCategories, null, 2), (err) => {
        if (err) {
          console.error('Error writing to category.json:', err);
          return res.status(500).json({ error: 'Failed to save category' });
        }

        res.status(201).json({ message: 'Top category added', category: newCategory });
      });
    });
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default app;
