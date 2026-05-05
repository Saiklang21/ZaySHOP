const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const JWT_SECRET = 'ZayShop_Super_Secret_Key_2026';
const usersFilePath = path.join(__dirname, '../data/auth_user.json');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email และ password ต้องไม่ว่าง' });
  }

  try {
    const fileData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileData);

    const user = users.find(u => u.username.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: อีเมลไม่ถูกต้อง' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Unauthorized: รหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign({ username: user.username, name: user.firstName }, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      status: 'success',
      message: 'เข้าสู่ระบบสำเร็จ',
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, firstName } = req.body;

  if (!email || !password || !firstName) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    const fileData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(fileData);

    const emailExists = users.some(u => u.username.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(409).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      registrationDate: new Date().toISOString()
    };

    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

    return res.status(201).json({
      status: 'success',
      message: 'สมัครสมาชิกสำเร็จ'
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
