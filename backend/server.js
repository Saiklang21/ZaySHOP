const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors()); // อนุญาตให้ Frontend ทุกโดเมนดึงข้อมูลจาก API นี้ได้
const PORT = 3000;

// Import Routes
const productRoutes = require('./routes/productRoutes');

app.use(express.json());

// ==========================================
// API Routes
// ==========================================
// 🌟 สั่งให้ Express ใช้งาน productRoutes เมื่อมีการเรียก URL ที่ขึ้นต้นด้วย /api/products
app.use('/api/products', productRoutes);

// API เช็กสถานะ
app.get('/api/status', (req, res) => {
    res.json({ status: 'success', message: 'Backend พร้อมลุย!' });
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});