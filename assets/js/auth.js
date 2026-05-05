// ต้องครอบด้วย DOMContentLoaded เพื่อรอให้หน้าเว็บโหลด HTML เสร็จก่อน ค่อยรันโค้ด JS
document.addEventListener('DOMContentLoaded', () => {
    
    // 🌟 พระเอกที่หายไป! ต้องประกาศตัวแปรและดึงฟอร์มมาจาก HTML ก่อนเสมอ
    const loginForm = document.getElementById('login-form');
    const alertBox = document.getElementById('alert-box');

    // ฟังก์ชันสำหรับแสดงข้อความแจ้งเตือน
    const showAlert = (message, type) => {
        if (alertBox) {
            alertBox.textContent = message;
            alertBox.className = `alert alert-${type} d-block`;
        }
    };

    const registerForm = document.getElementById('register-form');

    // กันเหนียว! เช็กก่อนว่าในหน้า HTML มี id="login-form" อยู่จริงๆ ใช่ไหม
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // ยิง Request ไปหา API Backend ของเรา
                const response = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                // เช็กสถานะ 401 Unauthorized (รหัสผิด / ไม่มีเมล)
                if (!response.ok) {
                    showAlert(`❌ ${data.message}`, 'danger');
                    return;
                }

                // ถ้าสถานะ 200: Login สำเร็จ!
                showAlert('✅ เข้าสู่ระบบสำเร็จ! กำลังพากลับหน้าหลัก...', 'success');
                
                // Save Token ลง LocalStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('userEmail', email);

                // รอ 1.5 วินาทีแล้วเด้งกลับไปหน้า shop
                setTimeout(() => {
                    window.location.href = 'shop.html'; 
                }, 1500);

            } catch (error) {
                console.error("Login Error:", error);
                showAlert('❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลังบ้านได้ (ลืมรัน Backend เปล่า!?)', 'danger');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const firstName = document.getElementById('firstName').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showAlert('❌ รหัสผ่านไม่ตรงกัน', 'danger');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, firstName, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    showAlert(`❌ ${data.message}`, 'danger');
                    return;
                }

                showAlert('✅ สมัครสมาชิกสำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } catch (error) {
                console.error('Register Error:', error);
                showAlert('❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์หลังบ้านได้', 'danger');
            }
        });
    }

    if (!loginForm && !registerForm) {
        console.error("🚨 บั๊ก: ไม่พบ login หรือ register form ในหน้าเว็บ");
    }
});