
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import PromoBanner from '../../models/Promo.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../../uploads');

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

// ✅ Admin Routes for Promo Banners

// Get all banners
app.get('/api/promos', async (req, res) => {
  try {
    const banners = await PromoBanner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Add new banner

app.post('/api/promos', upload.single('imageUrl'), async (req, res) => {
  try {
    const { title, description, ctaText, ctaLink } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const banner = new PromoBanner({
      title,
      description,
      imageUrl, // now stores the uploaded file path
      ctaText,
      ctaLink,
    });

    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    console.error("Error saving promo:", err);
    res.status(500).json({ error: "Failed to save banner" });
  }
});


// Update banner
app.put('/api/promos/:id', async (req, res) => {
  try {
    const { title, description, imageUrl, ctaText, ctaLink } = req.body;

    const updated = await PromoBanner.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, ctaText, ctaLink },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// Delete banner
app.delete('api/promos/:id', async (req, res) => {
  try {
    await PromoBanner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default app;
