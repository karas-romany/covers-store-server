const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Cover = require('./models/Cover');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// الصفحة الرئيسية لتأكيد عمل السيرفر
app.get('/', (req, res) => {
  res.send('سيرفر متجر الجرابات شغال بنجاح!');
});

// 1. API لجلب كل الجرابات أو الفلترة حسب الماركة
app.get('/api/covers', async (req, res) => {
  try {
    const { brand } = req.query;
    let query = {};
    if (brand) {
      query.brand = { $regex: new RegExp(brand, 'i') };
    }
    const covers = await Cover.find(query);
    res.status(200).json(covers);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب البيانات', error: error.message });
  }
});

// 2. API لإضافة جراب جديد
app.post('/api/covers', async (req, res) => {
  try {
    const newCover = new Cover(req.body);
    const savedCover = await newCover.save();
    res.status(201).json(savedCover);
  } catch (error) {
    res.status(400).json({ message: 'فشل في إضافة الجراب', error: error.message });
  }
});

// رابط الاتصال مباشرة بـ MongoDB Atlas
const MONGO_URI = 'mongodb+srv://karasromany23390_db_user:YPAFt2MMEhWwHZ5w@cluster0.fbopz0b.mongodb.net/coversStore?retryWrites=true&w=majority';
const PORT = 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('تم الاتصال بقاعدة بيانات MongoDB Atlas بنجاح!');
    app.listen(PORT, () => {
      console.log(`السيرفر يعمل الآن على البورت ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('خطأ في الاتصال بقاعدة البيانات:', err.message);
  });