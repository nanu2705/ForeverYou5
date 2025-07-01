import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const app = express();

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, '../../data.json'); // Adjust relative to this file's location

  // ✅ Multer setup
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
  const upload = multer({ storage });
  
// ✅ API to get all categories from data.json
app.get('/api/categories', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading data.json:", err);
      return res.status(500).json({ error: 'Failed to load categories' });
    }

    try {
      const parsed = JSON.parse(data);
      const categories = Array.isArray(parsed) ? parsed : [parsed]; // ensure it's always an array
      res.json(categories);
    } catch (e) {
      console.error("JSON parse error:", e);
      res.status(500).json({ error: 'Invalid JSON in data.json' });
    }
  });
});


export default app;
