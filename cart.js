/**
 * ระบบจัดการตะกร้าสินค้า (Cart System)
 * ใช้ LocalStorage ในการเก็บข้อมูล
 */

const Cart = {
  key: 'hft_cart_data',
  listeners: [],

  // ดึงข้อมูลตะกร้า
  getCart() {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  },

  // บันทึกข้อมูลตะกร้า
  saveCart(cart) {
    localStorage.setItem(this.key, JSON.stringify(cart));
    this.notify();
  },

  // เพิ่มสินค้าเข้าตะกร้า
  add(product) {
    let cart = this.getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1
      });
    }
    
    this.saveCart(cart);
  },

  // ลบสินค้าออก
  remove(productId) {
    let cart = this.getCart().filter(item => item.id !== productId);
    this.saveCart(cart);
  },

  // ปรับจำนวนสินค้า
  updateQuantity(productId, delta) {
    let cart = this.getCart();
    const item = cart.find(i => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
      }
      this.saveCart(cart);
    }
  },

  // ล้างตะกร้า
  clear() {
    this.saveCart([]);
  },

  // คำนวณราคารวม
  getTotal() {
    return this.getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // นับจำนวนชิ้นทั้งหมด
  getCount() {
    return this.getCart().reduce((sum, item) => sum + item.quantity, 0);
  },

  // ระบบแจ้งเตือนเมื่อมีการเปลี่ยนแปลงข้อมูล
  onUpdate(callback) {
    this.listeners.push(callback);
    // เรียกใช้ครั้งแรกเพื่อให้ UI อัปเดตทันที
    callback(this.getCart());
  },

  notify() {
    const cart = this.getCart();
    this.listeners.forEach(callback => callback(cart));
  }
};

// ส่งออก Cart ไปยัง Global Scope เพื่อให้ไฟล์อื่นเรียกใช้ได้
window.Cart = Cart;
