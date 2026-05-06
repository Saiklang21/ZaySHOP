// ==========================================
// Cart State (ตัวแปรเก็บสถานะตะกร้า)
// ==========================================
let cart = {}; 

// ==========================================
// Cart LocalStorage Functions (ระบบเซฟ/โหลด)
// ==========================================

// 1. ฟังก์ชันโหลดตะกร้าจาก LocalStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('zayShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart); 
    }
}

// 2. ฟังก์ชันเซฟตะกร้าลง LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem('zayShopCart', JSON.stringify(cart)); 
}

// ==========================================
// Cart Functions (ฟังก์ชันระบบตะกร้า)
// ==========================================

function handleAddToCart(event) {
    const button = event.target.closest('.add-to-cart');
    if (!button) return;

    const productId = button.dataset.productId;
    const productPrice = parseFloat(button.dataset.productPrice);

    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = {
            price: productPrice,
            quantity: 1
        };
    }

    saveCartToLocalStorage(); 
    updateCartUI();

    const toastElement = document.getElementById('cartToast');
    if (toastElement) {
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
    }
}

function updateCartUI() {
    const cartBadge = document.getElementById('cart-badge');
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    if (!cartContainer) return;
    if (typeof allProducts === 'undefined' || allProducts.length === 0) return; 

    let totalItems = 0;
    let totalPrice = 0;
    let cartHTML = '';

    for (const productId in cart) {
        const item = cart[productId];
        totalItems += item.quantity;
        totalPrice += (item.price * item.quantity);

        const product = allProducts.find(p => p.id === parseInt(productId));

        if (product) {
            cartHTML += `
                <div class="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <img src="${product.image}" alt="${product.name}" class="rounded" style="width: 70px; height: 70px; object-fit: cover;">
                    <div class="ms-3 flex-grow-1" style="padding-left: 15px;">
                        <h6 class="mb-1 text-dark">${product.name}</h6>
                        <small class="text-muted">$${item.price.toFixed(2)}</small>
                        <div class="input-group input-group-sm mt-2" style="max-width: 100px;">
                            <button class="btn btn-outline-success btn-minus" type="button" data-product-id="${productId}">-</button>
                            <input type="text" class="form-control text-center px-0 bg-white" value="${item.quantity}" readonly>
                            <button class="btn btn-outline-success btn-plus" type="button" data-product-id="${productId}">+</button>
                        </div>
                    </div>
                    <div class="text-end">
                        <strong class="text-success">$${(item.price * item.quantity).toFixed(2)}</strong>
                    </div>
                </div>
            `;
        }
    }

    if (cartBadge) cartBadge.innerText = totalItems;

    if (totalItems === 0) {
        cartContainer.innerHTML = '<p class="text-center text-muted mt-5">ตะกร้าของคุณว่างเปล่า</p>';
        if(cartTotalPrice) cartTotalPrice.innerText = '$0.00';
    } else {
        cartContainer.innerHTML = cartHTML;
        if(cartTotalPrice) cartTotalPrice.innerText = `$${totalPrice.toFixed(2)}`;
    }
}

// ==========================================
// Cart Event Listeners (ผูก Event ตะกร้าทั้งหมดไว้ที่นี่)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. โหลดข้อมูลตะกร้าเมื่อเปิดหน้าเว็บ
    loadCartFromLocalStorage();

    // 2. ดักจับปุ่ม Add to Cart หน้าสินค้า
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.addEventListener('click', handleAddToCart);
    }

    // 3. ดักจับปุ่มเปิดตะกร้า (ไอคอนรถเข็น)
    const cartIconBtn = document.querySelector('[data-bs-target="#cartOffcanvas"]');
    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cartOffcanvasElement = document.getElementById('cartOffcanvas');
            if (cartOffcanvasElement) {
                const bsOffcanvas = new bootstrap.Offcanvas(cartOffcanvasElement);
                bsOffcanvas.show();
            }
        });
    }

    // 4. ดักจับปุ่มบวก/ลบสินค้าในตะกร้า
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btnPlus = e.target.closest('.btn-plus');
            if (btnPlus) {
                const productId = btnPlus.dataset.productId;
                if (cart[productId]) {
                    cart[productId].quantity += 1;
                    saveCartToLocalStorage(); 
                    updateCartUI(); 
                }
                return;
            }

            const btnMinus = e.target.closest('.btn-minus');
            if (btnMinus) {
                const productId = btnMinus.dataset.productId;
                if (cart[productId]) {
                    if (cart[productId].quantity > 1) {
                        cart[productId].quantity -= 1;
                    } else {
                        delete cart[productId];
                    }
                    saveCartToLocalStorage(); 
                    updateCartUI(); 
                }
                return;
            }
        });
    }

    // ==========================================
    // 5. ดักจับปุ่ม "ดำเนินการชำระเงิน" (Go to Checkout)
    // ==========================================
    const btnGoCheckout = document.getElementById('btn-go-checkout');
    
    if (btnGoCheckout) { // เช็กว่าหน้านี้มีปุ่มนี้ไหม
        btnGoCheckout.addEventListener('click', function(e) {
            e.preventDefault();

            // 5.1 ตรวจสอบว่าตะกร้าว่างไหม
            if (Object.keys(cart).length === 0) {
                alert('ตะกร้าสินค้าว่างเปล่า กรุณาเลือกสินค้าก่อนครับ!');
                return;
            }

            // 5.2 แปลง Object `cart` ให้กลายเป็น Array ตามที่หน้า checkout.html รอรับอยู่
            const cartArrayForCheckout = [];
            
            for (const productId in cart) {
                const item = cart[productId];
                // ดึงชื่อสินค้าจาก allProducts มาแนบให้ด้วย
                const product = typeof allProducts !== 'undefined' ? allProducts.find(p => p.id === parseInt(productId)) : null;
                
                cartArrayForCheckout.push({
                    productId: parseInt(productId),
                    name: product ? product.name : 'Product', // เผื่อหาชื่อไม่เจอ
                    price: item.price,
                    quantity: item.quantity
                });
            }

            // 5.3 แพ็ค Array ยัดลง localStorage ในชื่อ 'cart' (เพื่อให้หน้า Checkout ดึงไปใช้)
            localStorage.setItem('cart', JSON.stringify(cartArrayForCheckout));

            // 5.4 เตะเปลี่ยนหน้าไปที่ checkout.html
            window.location.href = 'checkout.html';
        });
    }

}); // <--- ปิด DOMContentLoaded ตรงนี้จุดเดียวจบครับ!