const express = require('express');
const router = express.Router();

// 🚨 ดึงไฟล์เชื่อมต่อ Database ที่เราสร้างไว้มาใช้งาน
const db = require('../database');

router.post('/', (req, res) => {
    try {
        // ✨ รับ userId ที่หน้าบ้านส่งมา
        const { cartItems, userId } = req.body;

        // Validate นิดนึงว่าส่ง userId มาจริงๆ ใช่ไหม
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: ไม่พบ User ID" });
        }

        // ... (โค้ดเช็ก Validate อื่นๆ ของลูกพี่) ...

        // ==========================================
        // 💾 ขั้นตอน: บันทึกข้อมูลลง SQLite
        // ==========================================
        const insertQuery = `INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)`;

        cartItems.forEach(item => {
            // โยน userId (ตัวเลข) ลงไปแทนที่ช่องอีเมลเดิมได้เลย!
            db.run(insertQuery, [userId, item.productId, item.quantity, (item.price * item.quantity)], function (err) {
                if (err) {
                    console.error('🔥 [DB Error]:', err.message);
                }
            });
        });
        // ==========================================

        return res.status(200).json({
            success: true,
            message: "🎉 บันทึกออเดอร์ลง Database สมบูรณ์แบบ!",
            clearCart: true
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;