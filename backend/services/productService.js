const productRepository = require('../repositories/productRepository');

class ProductService {
    async getProducts() {
        // อนาคตถ้าจะเพิ่มลอจิก คัดกรองสินค้า หรือคำนวณส่วนลด ให้ทำในไฟล์นี้ครับ
        const products = await productRepository.getAllProducts();
        return products;
    }
}

module.exports = new ProductService();