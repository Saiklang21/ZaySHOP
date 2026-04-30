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
    if (allProducts.length === 0) return; 

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
// Cart Event Listeners (ผูก Event ตะกร้า)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    loadCartFromLocalStorage();

    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        productContainer.addEventListener('click', handleAddToCart);
    }

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
});