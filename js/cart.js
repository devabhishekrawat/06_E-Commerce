import { products1, products2, testimonials } from "./data.js";
import { cartHeader } from "./header.js";

const user = JSON.parse(sessionStorage.getItem("user"));

if (!user?.isLoggedIn) {
    window.location.href = "./login.html";
}


const allProducts = [...products1, ...products2];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cart)

let appliedDiscount = 0;

document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".top-banner");
    const closeButton = document.querySelector(".top-banner__close");
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user?.isLoggedIn === true && banner) {
        banner.style.display = "none";
    } else if (closeButton) {
        closeButton.addEventListener("click", () => {
            banner.style.display = "none";
        });
    }
    cartHeader()
    renderCart();
    setupPromoCode();
    setupCheckout();
});

function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty">Your cart is empty.</div>`;
        updateSummary();
        return;
    }

    container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
        <img src="${item.image}" alt="${item.productName}" class="cart-item__img">

        <div class="cart-item__info">
            <div class="cart-item__header">
                <h3 class="cart-item__title">${item.productName}</h3>

                <button
                    type="button"
                    class="cart-item__delete-btn"
                    data-index="${index}"
                    aria-label="Delete ${item.productName}">
                    <img
                        src="../assets/icons/delete.svg"
                        alt=""
                        class="cart-item__delete-icon">
                </button>
            </div>

            <p class="cart-item__meta">
                Size: <span>${item.size || "Medium"}</span>
            </p>

            <p class="cart-item__meta">
                Color: <span>${item.color || "White"}</span>
            </p>

            <div class="cart-item__bottom">
                <span class="cart-item__price">$${item.price}</span>

                <div class="cart-item__stepper">
                    <button type="button" class="btn-decrease" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="btn-increase" data-index="${index}">+</button>
                </div>
            </div>
        </div>
    </div>
`).join("");


    setupItemEvents();
    updateSummary();
}

function setupItemEvents() {
    document.querySelectorAll(".cart-item__delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const idx = e.currentTarget.dataset.index;
            cart.splice(idx, 1);
            saveCart();
        });
    });

    document.querySelectorAll(".btn-decrease").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const idx = e.currentTarget.dataset.index;
            if (cart[idx].quantity > 1) {
                cart[idx].quantity--;
                saveCart();
            }
        });
    });

    document.querySelectorAll(".btn-increase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const idx = e.currentTarget.dataset.index;
            cart[idx].quantity++;
            saveCart();
        });
    });
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function setupPromoCode() {
    const applyBtn = document.getElementById("promo-apply-btn");
    const input = document.getElementById("promo-input");

    if (!applyBtn || !input) return;

    applyBtn.addEventListener("click", () => {
        const code = input.value.trim().toUpperCase();

        if (code === "SAVE10") {
            appliedDiscount = 10;
        } else if (code === "SAVE20") {
            appliedDiscount = 20;
        } else {
            appliedDiscount = 0;
            alert("Invalid Promo Code");
        }

        updateSummary();
    });
}

function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
    const deliveryFee = subtotal > 0 ? 15 : 0;
    const total = subtotal - discountAmount + deliveryFee;

    document.getElementById("summary-subtotal").textContent = `$${subtotal}`;
    document.getElementById("summary-discount-label").textContent = `Discount (-${appliedDiscount}%)`;
    document.getElementById("summary-discount").textContent = `-$${discountAmount}`;
    document.getElementById("summary-delivery").textContent = `$${deliveryFee}`;
    document.getElementById("summary-total").textContent = `$${total}`;
}

function showSuccessModal() {
    const modal = document.createElement("div");

    modal.className = "success-modal";

    modal.innerHTML = `
        <div class="success-modal__content">
            <div class="success-modal__icon">✓</div>
            <h2>Order Successful!</h2>
            <p>Your order has been successfully completed.</p>
            <a  hreg="./index.html" class="success-modal__btn">
                Continue Shopping
            </a>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".success-modal__btn").addEventListener("click", () => {
        modal.remove();
    });
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 2000);
}



function setupCheckout() {
    const checkoutBtn = document.getElementById("checkout-btn");

    if (!checkoutBtn) return;

    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        localStorage.removeItem("cart");
        cart = [];
        appliedDiscount = 0;

        renderCart();
        showSuccessModal();
    });
}
