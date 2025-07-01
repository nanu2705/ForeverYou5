import express from 'express';
import User from '../../models/Contact.js';

const app = express();

// ✅ GET all contact submissions
app.get('/admin/contacts', async (req, res) => {
  try {
    const contacts = await User.find({}, 'name email mobile message createdAt').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ✅ DELETE contact by ID
app.delete('/api/admin/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ success: false, error: "Failed to delete contact" });
  }
});

export default app;
