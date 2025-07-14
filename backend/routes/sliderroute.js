import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import SliderImage from '../models/SliderImage.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/api/slider', async (req, res) => {
  const images = await SliderImage.find();
  res.json({ success: true, data: images });
});

app.post('/api/slider', upload.single('imageUrl'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Image is required' });

  const { productRoute } = req.body; // 👈 get route from form

  const newImage = new SliderImage({
    imageUrl: `/uploads/${req.file.filename}`,
    productRoute: productRoute || '/' // fallback to home
  });

  await newImage.save();
  res.json({ success: true, message: 'Image uploaded', data: newImage });
});


app.delete('/api/slider/:id', async (req, res) => {
  const image = await SliderImage.findById(req.params.id);
  if (!image) return res.status(404).json({ error: 'Image not found' });

  fs.unlink(`.${image.imageUrl}`, (err) => {
    if (err) console.error('File delete error:', err);
  });

  await SliderImage.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Image deleted' });
});

export default app;
