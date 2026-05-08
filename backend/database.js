const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// กำหนด Path ให้สร้างไฟล์ store.db ไว้ในโปรเจกต์
const dbPath = path.join(__dirname, 'store.db');

// เปิดการเชื่อมต่อฐานข้อมูล
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('🔥 [DBA Alert] เกิดข้อผิดพลาดในการเชื่อมต่อ SQLite:', err.message);
    } else {
        console.log('✅ [DBA] เชื่อมต่อกับฐานข้อมูล store.db สำเร็จแล้ว!');
    }
});

// ในไฟล์ database.js
db.serialize(() => {
    // 1. ตาราง Users (สมาชิก)
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT
    )`);

    // 2. ตาราง Orders (สั่งซื้อ)
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        order_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, -- เชื่อมกับ users.id
        product_id INTEGER,
        quantity INTEGER,
        total_price REAL,
        order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);
});

// ส่งออก module ไปให้ไฟล์อื่น (เช่น server.js หรือ routes) ใช้งาน
module.exports = db;