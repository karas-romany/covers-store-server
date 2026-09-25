const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection String
// ملاحظة: استبدل الرابط أدناه برابط الاتصال الخاص بك من MongoDB Atlas إذا كان مختلفاً
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://karas:karas123@cluster0.mongodb.net/covers-store?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Routes
const coverRoutes = require('./models/Cover'); // استدعاء الموديل أو الـ Routes الخاصة بك

// Root Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to Mobile Covers Store API" });
});

// API Routes
// يمكنك إضافة الـ Routes الخاصة بك هنا مثلاً:
// app.use('/api/covers', require('./routes/coverRoutes'));

// For local testing
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// هام جداً لعمل Express على منصة Vercel
module.exports = app;