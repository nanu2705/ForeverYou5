// routes/PromoBannerRoutes.js

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import PromoBanner from '../models/Promo.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');

// ✅ Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ PUBLIC ROUTES (GET all banners)
app.get('/api/promos', async (req, res) => {
  try {
    const banners = await PromoBanner.find().sort({ createdAt: -1 });

const updatedBanners = banners.map(b => ({
  ...b._doc,
  imageUrl: b.imageUrl ? `${req.protocol}://${req.get('host')}${b.imageUrl}` : '',
}));

res.json(updatedBanners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get banners' });
  }
});

// ✅ ADMIN ROUTES (CRUD operations)

// POST: Create new banner with image upload
app.post('/api/promos', upload.single('imageUrl'), async (req, res) => {
  try {
    const { title, description, ctaText, ctaLink } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const banner = new PromoBanner({ title, description, imageUrl, ctaText, ctaLink });
    await banner.save();
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save banner' });
  }
});

// PUT: Update banner by ID with optional image
app.put('/api/promos/:id', upload.single('imageUrl'), async (req, res) => {
  try {
    const { title, description, ctaText, ctaLink } = req.body;
    const updateData = { title, description, ctaText, ctaLink };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await PromoBanner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// DELETE: Remove banner by ID
app.delete('/api/promos/:id', async (req, res) => {
  try {
    await PromoBanner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default app;
