const productService = require('../services/productService');

// Handler สำหรับ GET /api/products
async function getProducts(req, res) {
    try {
        // เรียกใช้ Service เพื่อดึงข้อมูล
        const products = await productService.getAllProducts();
        
        // ส่งผลลัพธ์กลับไปให้ Frontend
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: products
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
            error: error.message
        });
    }
}

module.exports = {
    getProducts
};