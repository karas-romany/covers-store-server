const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware - CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://karasromany23390_db_user:karas123@cluster0.mongodb.net/covers-store?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// تعريف الـ Schema والـ Model مباشرة لمنع أخطاء المسارات
const coverSchema = new mongoose.Schema({
  title: String,
  brand: String,
  modelName: String,
  price: Number,
  imageUrl: String
});

const Cover = mongoose.models.Cover || mongoose.model('Cover', coverSchema);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Mobile Covers Store API" });
});

// GET /api/covers
app.get('/api/covers', async (req, res) => {
  try {
    const { brand } = req.query;
    const filter = brand ? { brand: new RegExp(brand, 'i') } : {};
    const covers = await Cover.find(filter);
    res.json(covers);
  } catch (error) {
    console.error('Error fetching covers:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST /api/covers
app.post('/api/covers', async (req, res) => {
  try {
    const newCover = new Cover(req.body);
    const savedCover = await newCover.save();
    res.status(201).json(savedCover);
  } catch (error) {
    console.error('Error adding cover:', error);
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = app;