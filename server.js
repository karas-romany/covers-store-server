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

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://karasromany23390_db_user:karas123@cluster0.fbopz0b.mongodb.net/covers-store?retryWrites=true&w=majority&appName=Cluster0";

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    const db = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    isConnected = db.connections[0].readyState === 1;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err;
  }
};

// Schemas & Models
const coverSchema = new mongoose.Schema({
  title: String,
  brand: String,
  modelName: String,
  price: Number,
  imageUrl: String
});

const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'maintenance' },
  isMaintenance: { type: Boolean, default: false }
});

const Cover = mongoose.models.Cover || mongoose.model('Cover', coverSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Mobile Covers Store API" });
});

// GET /api/settings - معرفة حالة الصيانة
app.get('/api/settings', async (req, res) => {
  try {
    await connectDB();
    let settings = await Settings.findOne({ key: 'maintenance' });
    if (!settings) {
      settings = await Settings.create({ key: 'maintenance', isMaintenance: false });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// POST /api/settings - تغيير حالة الصيانة من الأدمن
app.post('/api/settings', async (req, res) => {
  try {
    await connectDB();
    const { isMaintenance } = req.body;
    let settings = await Settings.findOneAndUpdate(
      { key: 'maintenance' },
      { isMaintenance },
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// GET /api/covers
app.get('/api/covers', async (req, res) => {
  try {
    await connectDB();
    const { brand } = req.query;
    const filter = brand ? { brand: new RegExp(brand, 'i') } : {};
    const covers = await Cover.find(filter);
    res.json(covers);
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
});

// POST /api/covers
app.post('/api/covers', async (req, res) => {
  try {
    await connectDB();
    const newCover = new Cover(req.body);
    const savedCover = await newCover.save();
    res.status(201).json(savedCover);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data', details: error.message });
  }
});

module.exports = app;