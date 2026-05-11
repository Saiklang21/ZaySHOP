const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// โยนหน้าที่ให้ Controller จัดการ
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;