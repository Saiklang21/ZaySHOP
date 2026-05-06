const express = require('express');
const router = express.Router();
const fs = require('fs').promises; // นำเข้า fs เพื่อจัดการไฟล์
const path = require('path');

// กำหนด Path ชี้ไปที่โฟลเดอร์ data ของเรา
const ordersFilePath = path.join(__dirname, '../data/orders.json');

router.post('/', async (req, res) => {
    try {
        const { cartItems, email, creditCard } = req.body;
        let errors = {};

        // 1. Validation: เช็กตะกร้า
        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            errors.cartItems = "Cart is empty or invalid data format.";
        }

        // 2. Validation: เช็กอีเมล
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            errors.email = "Invalid email address format.";
        }

        // 3. Validation: เช็กบัตรเครดิต 16 หลัก
        const ccRegex = /^\d{16}$/;
        if (!creditCard || !ccRegex.test(creditCard)) {
            errors.creditCard = "Credit card must be exactly 16 digits.";
        }

        // ถ้ามี Error ให้ Return 400 และไม่เคลียร์ตะกร้า
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors,
                clearCart: false 
            });
        }

        // 4. คำนวณราคารวม
        const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // ==========================================
        // 💾 ขั้นตอน: บันทึกข้อมูลลง orders.json
        // ==========================================
        let orders = [];
        try {
            // ลองอ่านไฟล์เดิมก่อน (ถ้ามี)
            const fileData = await fs.readFile(ordersFilePath, 'utf-8');
            orders = JSON.parse(fileData);
        } catch (err) {
            // ถ้ายังไม่มีไฟล์นี้ ให้เริ่มต้นด้วย Array ว่างๆ
            console.log("ยังไม่มีไฟล์ orders.json กำลังสร้างใหม่...");
        }

        // สร้าง Object ของออเดอร์ใหม่
        const newOrder = {
            orderId: "ORD-" + Date.now(), // สร้างรหัสบิลแบบง่ายๆ จากเวลาปัจจุบัน
            email: email,
            // ⚠️ ทริคความปลอดภัย: เราไม่ควรเก็บเลขบัตรเต็มๆ ให้เก็บแค่ 4 ตัวท้ายพอครับ
            creditCardLast4: creditCard.substring(12), 
            total: totalAmount,
            items: cartItems,
            orderDate: new Date().toISOString()
        };

        // เอาออเดอร์ใหม่ไปต่อท้าย Array เดิม
        orders.push(newOrder);


        // เพิ่มบรรทัดนี้เพื่อแอบดูว่ามันพยายามจะเซฟไฟล์ไปไว้ที่ไหน!
        console.log("🚀 กำลังเตรียมเซฟออเดอร์ไปที่โฟลเดอร์:", ordersFilePath);

        // เขียนทับกลับลงไปในไฟล์ orders.json (โค้ดเดิมของเรา)
        await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2), 'utf-8');
        // ==========================================

        // ส่งข้อความกลับไปบอกหน้าบ้านว่าสำเร็จแล้ว
        return res.status(200).json({
            success: true,
            message: "Order saved successfully!",
            total: totalAmount,
            clearCart: true 
        });

    } catch (error) {
        console.error("Checkout Error:", error);
        return res.status(400).json({
            success: false,
            message: "Failed to save the order.",
            errors: { database: "Internal error while saving order to JSON." },
            clearCart: false
        });
    }
});

module.exports = router;