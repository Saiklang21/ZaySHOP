// สมมติว่าฟอร์ม Checkout ของเรามี id="checkout-form"
document.getElementById('checkout-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // หยุดไม่ให้หน้าเว็บรีเฟรชตอนกดปุ่ม Submit

    // 1. ดึงข้อมูลจากช่อง Input หน้าเว็บ
    const emailValue = document.getElementById('checkout-email').value;
    const ccValue = document.getElementById('checkout-cc').value;

    // 2. ดึงข้อมูลตะกร้าสินค้าจาก LocalStorage (สมมติว่าเราเซฟไว้ในชื่อ 'cart')
    // ถ้าไม่มีของในตะกร้า จะให้เป็น Array ว่าง []
    let cartItemsArray = JSON.parse(localStorage.getItem('cart')) || [];

    // --- เคลียร์ข้อความแจ้งเตือน Error สีแดงๆ ตัวเก่าทิ้งก่อน ---
    // (ลูกพี่ต้องเตรียมแท็ก <span id="email-error"></span> ไว้ใต้ช่องกรอกแต่ละช่องด้วยนะครับ)
    document.getElementById('email-error').innerText = '';
    document.getElementById('cc-error').innerText = '';
    document.getElementById('cart-error').innerText = '';

    try {
        // 3. ยิง API ด้วย fetch() ไปที่ POST Route ใหม่ของเรา
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // บอก Backend ว่าเราส่ง JSON ไปนะ
            },
            body: JSON.stringify({
                email: emailValue,
                creditCard: ccValue,
                cartItems: cartItemsArray
            })
        });

        // แปลงคำตอบที่ได้จาก Backend กลับมาเป็น Object
        const result = await response.json();

        // 4. เช็ก Status (ดัก Error 400 ตามที่อาจารย์สั่ง)
        if (!response.ok) {
            // ถ้าพัง (Status ไม่ใช่ 200-299)
            console.log("Validation Failed:", result.errors);
            
            // นำข้อความ Error เฉพาะเจาะจง (Specific error) ไปโชว์ใต้ฟิลด์นั้นๆ
            if (result.errors.email) {
                document.getElementById('email-error').innerText = result.errors.email;
            }
            if (result.errors.creditCard) {
                document.getElementById('cc-error').innerText = result.errors.cc; // โชว์ error บัตรเครดิต
                document.getElementById('cc-error').innerText = result.errors.creditCard;
            }
            if (result.errors.cartItems) {
                document.getElementById('cart-error').innerText = result.errors.cartItems;
            }
            
            // 🚨 CRUCIAL: ไม่สั่ง localStorage.removeItem('cart') เด็ดขาด! ตะกร้าลูกค้าจะยังอยู่เหมือนเดิม
            return; // จบการทำงาน ไม่ไปต่อ
        }

        // 5. ถ้าสำเร็จ (Status 200)
        alert(`🎉 ${result.message}\nยอดรวมทั้งหมด: $${result.total}`);
        
        // เช็ก Flag จาก Backend ว่าอนุญาตให้เคลียร์ตะกร้าได้
        if (result.clearCart) {
            localStorage.removeItem('cart'); // ล้างตะกร้าหน้าบ้านทิ้ง
            window.location.href = 'index.html'; // เด้งกลับไปหน้าแรก หรือหน้า Thank you
        }

    } catch (error) {
        // ดัก Error กรณีเน็ตหลุด หรือ Backend ดับ
        console.error("Fetch Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
});