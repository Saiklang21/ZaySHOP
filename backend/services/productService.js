const fs = require('fs').promises;
const path = require('path');

// ชี้เป้าหมายไปที่ไฟล์ products.json ในโฟลเดอร์ data
const dataPath = path.join(__dirname, '../data/products.json');

// ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด
async function getAllProducts() {
    try {
        const fileData = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileData);
    } catch (error) {
        // โยน Error กลับไปให้ Controller จัดการ
        throw new Error('ไม่สามารถอ่านข้อมูลสินค้าจากไฟล์ JSON ได้'); 
    }
}

module.exports = {
    getAllProducts
};