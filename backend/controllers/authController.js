const userService = require('../services/userService');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName } = req.body;
    if (!email || !password || !firstName) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }
    
    await userService.registerUser(email, password, firstName);
    res.status(201).json({ message: 'สมัครสมาชิกสำเร็จ' });
  } catch (error) {
    if (error.message === 'อีเมลนี้ถูกใช้งานแล้ว') return res.status(409).json({ message: error.message });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.authenticateUser(email, password);
    res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', ...result });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};