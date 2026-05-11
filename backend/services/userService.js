const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'ZayShop_Super_Secret_Key_2026';

class UserService {
  async registerUser(email, password, firstName) {
    // Business Rule 1: เช็กอีเมลซ้ำ
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error('อีเมลนี้ถูกใช้งานแล้ว');

    // Business Rule 2: Hash รหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: Date.now(),
      username: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      registrationDate: new Date().toISOString()
    };

    await userRepository.save(newUser);
    return newUser;
  }

  async authenticateUser(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Unauthorized: อีเมลไม่ถูกต้อง');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Unauthorized: รหัสผ่านไม่ถูกต้อง');

    const token = jwt.sign({ username: user.username, name: user.firstName }, JWT_SECRET, { expiresIn: '24h' });
    return { user, token };
  }
}
module.exports = new UserService();