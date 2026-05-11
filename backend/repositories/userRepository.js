const fs = require('fs').promises;
const path = require('path');

// ชี้เป้าไปที่ไฟล์ JSON (ถอยหลัง 1 โฟลเดอร์ไปที่ backend แล้วเข้า data)
const usersFilePath = path.join(__dirname, '../data/auth_user.json');

class UserRepository {
  // ดึงข้อมูล User ทั้งหมด
  async getAllUsers() {
    try {
      const fileData = await fs.readFile(usersFilePath, 'utf-8');
      return fileData ? JSON.parse(fileData) : [];
    } catch (error) {
      if (error.code === 'ENOENT') return []; // ถ้าไม่เจอไฟล์ให้คืนค่า array ว่าง
      throw error;
    }
  }

  // ค้นหา User ด้วยอีเมล
  async findByEmail(email) {
    const users = await this.getAllUsers();
    return users.find(u => u.username.toLowerCase() === email.toLowerCase());
  }

  // เพิ่ม User ใหม่ลงไฟล์
  async addUser(newUser) {
    const users = await this.getAllUsers();
    users.push(newUser);
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  }
}

module.exports = new UserRepository();