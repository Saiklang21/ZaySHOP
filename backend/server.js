const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
app.use(cors()); // อนุญาตให้ Frontend ทุกโดเมนดึงข้อมูลจาก API นี้ได้
const PORT = 3000;

// Serve frontend files from the parent folder
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Import Routes
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

// ==========================================
// API Routes
// ==========================================
// 🌟 สั่งให้ Express ใช้งาน productRoutes เมื่อมีการเรียก URL ที่ขึ้นต้นด้วย /api/products
app.use('/api/products', productRoutes);
app.use('/api', authRoutes);

// API เช็กสถานะ
app.get('/api/status', (req, res) => {
    res.json({ status: 'success', message: 'Backend พร้อมลุย!' });
});

// Serve index.html on root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});