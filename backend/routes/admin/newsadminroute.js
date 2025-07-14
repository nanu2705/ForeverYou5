import express from 'express';
import News from '../../models/Newsletter.js';

const app = express();

// ✅ GET all newsletter subscribers
app.get('/api/admin/newsletter', async (req, res) => {
  try {
    const subscribers = await News.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Failed to fetch newsletter subscribers:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ✅ DELETE newsletter subscriber by ID
app.delete('/api/admin/newsletter/:id', async (req, res) => {
  try {
    const result = await News.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
    res.json({ success: true, message: 'Subscriber deleted' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


export default app;
