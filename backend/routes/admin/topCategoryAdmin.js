// routes/Api/topCategoryAdmin.js
import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const categoryJsonPath = path.join(__dirname, '../../category.json');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Create new top category
app.post('/api/top-categories', upload.single('image'), (req, res) => {
  const { title, categories } = req.body;

  if (!title || !categories || !req.file) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const categoryRef = title.toLowerCase().replace(/\s+/g, '-');
  const imagePath = `uploads/${req.file.filename}`;
  const parsedCategories = JSON.parse(categories);

  fs.readFile(categoryJsonPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Read error' });

    const list = JSON.parse(data);
    const newCategory = {
      id: Date.now(),
      title,
      categoryRef,
      img: imagePath,
      categories: parsedCategories
    };

    list.push(newCategory);

    fs.writeFile(categoryJsonPath, JSON.stringify(list, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Write error' });
      res.status(201).json({ success: true });
    });
  });
});

// ✅ Delete top category
app.delete('/api/top-categories/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile(categoryJsonPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Read error' });

    let list = JSON.parse(data);
    list = list.filter(cat => cat.id !== id);

    fs.writeFile(categoryJsonPath, JSON.stringify(list, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Write error' });
      res.json({ success: true });
    });
  });
});

// ✅ Edit top category
app.put('/api/top-categories/:id', upload.single('image'), (req, res) => {
  const { title, categories } = req.body;
  const id = parseInt(req.params.id);
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const parsedCategories = JSON.parse(categories);

  fs.readFile(categoryJsonPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Read error' });

    let list = JSON.parse(data);
    const index = list.findIndex(cat => cat.id === id);
    if (index === -1) return res.status(404).json({ error: 'Category not found' });

    list[index].title = title;
    list[index].categoryRef = title.toLowerCase().replace(/\s+/g, '-');
    list[index].categories = parsedCategories;
    if (imagePath) list[index].img = imagePath;

    fs.writeFile(categoryJsonPath, JSON.stringify(list, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Write error' });
      res.json({ success: true });
    });
  });
});

export default app;
