const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// เมื่อมีคนยิง GET Request มาที่เส้นทางนี้ ให้เรียกฟังก์ชัน getProducts จาก Controller
// หมายเหตุ: ตรงนี้เราเขียนแค่ '/' เพราะเดี๋ยวใน server.js เราจะนำไปต่อท้าย '/api/products' ครับ
router.get('/', productController.getProducts);

// อนาคตสามารถเพิ่ม route อื่นๆ ได้ง่ายๆ เช่น:
// router.get('/:id', productController.getProductById);
// router.post('/', productController.createProduct);

module.exports = router;