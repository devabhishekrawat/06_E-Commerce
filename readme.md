# 🛍️ Shop.co – E-Commerce Web Application

A modern, responsive, and feature-rich e-commerce front-end application built for online shopping using Vanilla JavaScript (ES6 Modules), SCSS (BEM methodology), and HTML5.

The platform provides users with an interactive, end-to-end e-commerce experience. It includes dedicated sections for:
- 🏠 **Landing Page & Brand Strips**
- 👕 **Dynamic Product Details & Image Gallery**
- 🌟 **Dynamic Star Ratings & Customer Reviews**
- 🛒 **Shopping Cart & Quantity Controls**
- 🏷️ **Promo Code & Discount Engine**
- 🔐 **Session Authentication & Protected Routes**

---

## 🌐 Live Demo & Repository

- 🔗 **Live Demo:** https://devabhishekrawat.github.io/06_E-Commerce/
- 💻 **GitHub Repository:** https://github.com/devabhishekrawat/06_E-Commerce.git


---

## ✨ Features

### 🎨 UI & Layout
- 🖼️ **Interactive Image Gallery**: Swap main product display images by clicking thumbnail options.
- 📑 **Tabbed Content Interface**: Switch seamlessly between Product Details, Customer Reviews, and FAQs.
- 💫 **Blur Mask Effects**: Smooth testimonial slider styled using modern SCSS mask filters.
- 📱 **Mobile-First Layout**: Fully responsive interface scaling across mobile, tablet, and desktop viewports.

### 🛒 Cart & Order Summary
- ➕ **Quantity Controls**: Dynamic incremental (`+`) and decremental (`-`) item count updates.
- 🗑️ **Item Deletion**: Single-click item removal directly from the cart layout.
- 🏷️ **Promo System**: Instant calculation of 10% or 20% discounts using promotional codes.
- 💾 **State Persistence**: Cart data stays saved across page refreshes via `localStorage`.

### 🔑 Authentication & Access
- 🔐 **Protected Routes**: Restricts access to cart and checkout pages for unauthenticated users.
- 👤 **Session Persistence**: Maintains user login state across sessions using `sessionStorage`.

---

## 🔑 Login Credentials

Use the following credentials to test authentication functionality:

- **Username / Email:** `admin@example.com`
- **Password:** `Admin@123` 

---

## 🏷️ Active Coupon Codes

| Coupon Code | Discount Applied |
| :--- | :--- |
| **`SAVE10`** | 10% Discount on Subtotal |
| **`SAVE20`** | 20% Discount on Subtotal |

---

## 🛠 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | HTML5, SCSS / CSS3, JavaScript (ES6 Modules) |
| **Architecture** | BEM (Block Element Modifier) Methodology |
| **Data Storage** | Browser `localStorage` & `sessionStorage` |
| **Dataset** | Custom JSON/JS Module (`data.js`) |

---

## 📁 Project Structure

```text
SHOP.CO/
│
├── index.html
├── cart.html
├── login.html
├── productDetail.html
│
├── css/
│   └── style.css
│
├── scss/
│   ├── style.scss
│   │
│   ├── abstracts/
│   │   └── _variables.scss
│   │
│   ├── base/
│   │   ├── _reset.scss
│   │   └── _typography.scss
│   │
│   ├── components/
│   │   ├── _header.scss
│   │   ├── _banner.scss
│   │   ├── _buttons.scss
│   │   ├── _product-card.scss
│   │   ├── _testimonial.scss
│   │   └── _footer.scss
│   │
│   ├── layout/
│   │   ├── _hero.scss
│   │   ├── _brands.scss
│   │   ├── _products.scss
│   │   └── _dress-style.scss
│   │
│   └── pages/
│       ├── _cart.scss
│       ├── _login.scss
│       └── _product-detail.scss
│
├── js/
│   ├── products.js
│   ├── cart.js
│   ├── productDetail.js
│   ├── login.js
│   └── data.js
│
└── assets/
    │
    ├── images/
    │   ├── products/
    │   └── background-images/
    │       ├── hero-bg.png
    │       ├── casual-1.png
    │       ├── formal-1.png
    │       ├── party-1.png
    │       └── gym-1.png
    │
    ├── icons/
    │   ├── search-icon.svg
    │   ├── cart-icon.svg
    │   ├── user-icon.svg
    │   ├── down-arrow.svg
    │   ├── humburger.svg
    │   ├── delete.svg
    │   ├── Star.svg
    │   ├── halfStar.svg
    │   ├── mail-icon.svg
    │   ├── twitter-icon.svg
    │   ├── facebook-icon.svg
    │   ├── instagram-icon.svg
    │   ├── github-icon.svg
    │   ├── visa-icon.svg
    │   ├── mastercard-icon.svg
    │   ├── paypal-icon.svg
    │   ├── apple-pay-icon.svg
    │   └── google-pay-icon.svg
    │
    └── fonts/
        ├── IntegralCF/
        └── Satoshi/


👨‍💻 Author
Abhishek Rawat