const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        return res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Product Controller Error:', error);
        return res.status(500).json({ success: false, message: 'Server Error: ไม่สามารถดึงข้อมูลสินค้าได้' });
    }
};