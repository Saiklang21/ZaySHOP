// ==========================================
// Global Variables (ตัวแปรเก็บสถานะหน้าร้าน)
// ==========================================
let allProducts = [];
let currentSearchTerm = '';
let currentCategory = 'All';

// ==========================================
// Functions (ฟังก์ชันการทำงานหลักหน้าร้าน)
// ==========================================

// 1. ฟังก์ชันดึงข้อมูลจาก API หลังบ้าน
async function loadProducts() {
    const container = document.getElementById('product-container');
    try {
        const response = await fetch('http://localhost:3000/api/products');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // รับข้อมูลมาเก็บไว้ในตัวแปร result ก่อน (ตอนนี้ result เป็น Object)
        const result = await response.json();
        
        // 🌟 จุดแก้บั๊ก: ต้องเจาะเข้าไปเอาเฉพาะ Array ที่อยู่ใน result.data
        allProducts = result.data; 
        
        // คราวนี้ allProducts เป็น Array แล้ว ส่งไป forEach ได้สบายๆ!
        renderProducts(allProducts); 
        
        updateCartUI();
        
    } catch (error) {
        console.error("Could not load products:", error);
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center mt-5">
                    <p class="text-danger h4"><i class="fas fa-exclamation-triangle"></i> ขออภัย! ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้</p>
                </div>
            `;
        }
    }
}

// 2. ฟังก์ชันวาด HTML สินค้าแบบ Dynamic
function renderProducts(productsToRender) {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    // ล้างข้อมูลเก่าก่อนเรนเดอร์ใหม่เสมอ
    container.innerHTML = ''; 

    // กรณีค้นหา/กรองแล้วไม่เจอสินค้าเลย
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center mt-5">
                <p class="text-muted h4">ไม่พบสินค้าที่คุณค้นหา หรือในหมวดหมู่นี้</p>
            </div>
        `;
        return;
    }

    productsToRender.forEach(product => {
        // สร้าง Rating ดาว
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += i <= product.rating 
                ? '<i class="text-warning fa fa-star"></i>' 
                : '<i class="text-muted fa fa-star"></i>';
        }

        // สร้างจุดสี (ตรวจสอบก่อนว่ามี property colors หรือไม่)
        let colorsHtml = '';
        if(product.colors && Array.isArray(product.colors)) {
            colorsHtml = product.colors.map(color => 
                `<span class="product-color-dot color-dot-${color} float-left rounded-circle ml-1"></span>`
            ).join('');
        }

        // สร้างข้อความไซส์
        let sizesHtml = product.sizes ? product.sizes.join('/') : '';

        // โครงสร้าง HTML สินค้าแต่ละชิ้น พร้อมฝัง Data Attributes สำหรับระบบตะกร้า
        const productHTML = `
            <div class="col-md-4">
                <div class="card mb-4 product-wap rounded-0">
                    <div class="card rounded-0">
                        <img class="card-img rounded-0 img-fluid" src="${product.image}" alt="${product.name}">
                        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                            <ul class="list-unstyled">
                                <li><a class="btn btn-success text-white" href="shop-single.html"><i class="far fa-heart"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="far fa-eye"></i></a></li>
                                <li><a class="btn btn-success text-white mt-2" href="shop-single.html"><i class="fas fa-cart-plus"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <a href="shop-single.html" class="h3 text-decoration-none">${product.name}</a>
                        <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                            <li>${sizesHtml}</li>
                            <li class="pt-2">${colorsHtml}</li>
                        </ul>
                        <ul class="list-unstyled d-flex justify-content-center mb-1">
                            <li>${starsHtml}</li>
                        </ul>
                        <p class="text-center mb-0">$${product.price.toFixed(2)}</p>
                        
                        <!-- ปุ่ม Add to Cart ที่เตรียมไว้รอ Event Delegation จาก cart.js -->
                        <p class="text-center mb-0 mt-3">
                            <button type="button" class="btn btn-primary add-to-cart" data-product-id="${product.id}" data-product-price="${product.price}">
                                Add to Cart
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// 3. ฟังก์ชันกรองข้อมูล
/**
 * กรองข้อมูลสินค้าตามคำค้นหา (Search Term) และหมวดหมู่ (Category)
 * 
 * @param {string} searchTerm - คำค้นหาที่ต้องการตรวจสอบกับชื่อสินค้า
 * @param {string} category - หมวดหมู่สินค้าที่ต้องการกรอง (เช่น 'Men', 'Women', 'All')
 * @returns {Array} - Array ของ Object สินค้าที่ผ่านเงื่อนไขการกรอง
 */
function filterProducts(searchTerm, category) {
    return allProducts.filter(product => {
        // เช็กเงื่อนไขหมวดหมู่
        const isCategoryMatch = category === 'All' || product.category === category;
        
        // เช็กเงื่อนไขคำค้นหา (Case-insensitive)
        const isSearchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // ต้องผ่านทั้งสองเงื่อนไข
        return isCategoryMatch && isSearchMatch;
    });
}

// ==========================================
// Event Listeners (ผูก Event เมื่อโหลดหน้าเว็บเสร็จ)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // โหลดข้อมูลสินค้าทันทีที่เปิดหน้าเว็บ
    loadProducts();

    // ------------------------------------------
    // ส่วนควบคุมการค้นหา (Search)
    // ------------------------------------------
    const searchInput = document.getElementById('inlineSearchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // ฟังก์ชันรันการค้นหา
    const executeSearch = () => {
        if(!searchInput) return;
        currentSearchTerm = searchInput.value; 
        const filtered = filterProducts(currentSearchTerm, currentCategory);
        renderProducts(filtered);
    };

    if (searchBtn && searchInput) {
        // ดักจับการคลิกที่ปุ่มแว่นขยาย
        searchBtn.addEventListener('click', executeSearch);
        
        // ดักจับการกดปุ่ม Enter ในช่องพิมพ์ค้นหา
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        });
    }

    // ------------------------------------------
    // ส่วนควบคุมหมวดหมู่ (Category Sidebar)
    // ------------------------------------------
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // ป้องกันหน้าเว็บกระตุก
            
            // อัปเดตตัวแปรสถานะหมวดหมู่
            currentCategory = e.target.getAttribute('data-category');
            
            // กรองและวาด HTML ใหม่
            const filtered = filterProducts(currentSearchTerm, currentCategory);
            renderProducts(filtered);
        });
    });

});