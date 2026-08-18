import { products1, products2 } from "./data.js";
import { cartHeader } from "./header.js";

const user = JSON.parse(sessionStorage.getItem("user"));

if (!user?.isLoggedIn) {
    window.location.href = "./login.html";
}

const allProducts = [...products1, ...products2];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedDiscount = 0;

document.addEventListener("DOMContentLoaded", () => {
    setupBanner();
    cartHeader();
    renderCart();
    setupPromoCode();
    setupCheckout();
});

function setupBanner() {
    const banner = document.querySelector(".top-banner");
    const closeButton = document.querySelector(".top-banner__close");
    const currentUser = JSON.parse(sessionStorage.getItem("user"));

    if (!banner) return;

    if (currentUser?.isLoggedIn) {
        banner.style.display = "none";
        return;
    }

    closeButton?.addEventListener("click", () => {
        banner.style.display = "none";
    });
}

function renderCart() {
    const container = document.getElementById("cart-items");

    if (!container) return;

    container.replaceChildren();

    if (!cart.length) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Your cart is empty.";

        container.appendChild(emptyMessage);
        updateSummary();
        return;
    }

    cart.forEach((item, index) => {
        container.appendChild(createCartItem(item, index));
    });

    updateSummary();
}

function createCartItem(item, index) {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.productName;
    image.className = "cart-item__img";

    const info = document.createElement("div");
    info.className = "cart-item__info";

    const header = document.createElement("div");
    header.className = "cart-item__header";

    const title = document.createElement("h3");
    title.className = "cart-item__title";
    title.textContent = item.productName;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "cart-item__delete-btn";
    deleteButton.dataset.index = index;
    deleteButton.setAttribute(
        "aria-label",
        `Delete ${item.productName}`
    );

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "../assets/icons/delete.svg";
    deleteIcon.alt = "";
    deleteIcon.className = "cart-item__delete-icon";

    deleteButton.appendChild(deleteIcon);
    header.append(title, deleteButton);

    const size = document.createElement("p");
    size.className = "cart-item__meta";
    size.append("Size: ");

    const sizeValue = document.createElement("span");
    sizeValue.textContent = item.size || "Medium";
    size.appendChild(sizeValue);

    const color = document.createElement("p");
    color.className = "cart-item__meta";
    color.append("Color: ");

    const colorValue = document.createElement("span");
    colorValue.textContent = item.color || "White";
    color.appendChild(colorValue);

    const bottom = document.createElement("div");
    bottom.className = "cart-item__bottom";

    const price = document.createElement("span");
    price.className = "cart-item__price";
    price.textContent = `$${item.price}`;

    const stepper = document.createElement("div");
    stepper.className = "cart-item__stepper";

    const decrease = document.createElement("button");
    decrease.type = "button";
    decrease.className =
        "cart-item__stepper-btn btn-decrease";
    decrease.dataset.index = index;
    decrease.textContent = "-";

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const increase = document.createElement("button");
    increase.type = "button";
    increase.className =
        "cart-item__stepper-btn btn-increase";
    increase.dataset.index = index;
    increase.textContent = "+";

    stepper.append(decrease, quantity, increase);
    bottom.append(price, stepper);

    info.append(header, size, color, bottom);
    cartItem.append(image, info);

    setupCartItemEvents(deleteButton, decrease, increase, index);

    return cartItem;
}

function setupCartItemEvents(deleteButton, decrease, increase, index) {
    deleteButton.addEventListener("click", () => {
        cart.splice(index, 1);
        saveCart();
    });

    decrease.addEventListener("click", () => {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            saveCart();
        }
    });

    increase.addEventListener("click", () => {
        cart[index].quantity++;
        saveCart();
    });
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function setupPromoCode() {
    const applyButton = document.getElementById("promo-apply-btn");
    const input = document.getElementById("promo-input");

    if (!applyButton || !input) return;

    applyButton.addEventListener("click", () => {
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
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const discount = Math.round(
        (subtotal * appliedDiscount) / 100
    );

    const delivery = subtotal > 0 ? 15 : 0;
    const total = subtotal - discount + delivery;

    document.getElementById("summary-subtotal").textContent =
        `$${subtotal}`;

    document.getElementById(
        "summary-discount-label"
    ).textContent = `Discount (-${appliedDiscount}%)`;

    document.getElementById("summary-discount").textContent =
        `-$${discount}`;

    document.getElementById("summary-delivery").textContent =
        `$${delivery}`;

    document.getElementById("summary-total").textContent =
        `$${total}`;
}

function showSuccessModal() {
    const modal = document.createElement("div");
    modal.className = "success-modal";

    const content = document.createElement("div");
    content.className = "success-modal__content";

    const icon = document.createElement("div");
    icon.className = "success-modal__icon";
    icon.textContent = "✓";

    const title = document.createElement("h2");
    title.className = "success-modal__title";
    title.textContent = "Order Successful!";

    const message = document.createElement("p");
    message.className = "success-modal__message";
    message.textContent =
        "Your order has been successfully completed.";

    const button = document.createElement("a");
    button.href = "./index.html";
    button.className = "success-modal__btn";
    button.textContent = "Continue Shopping";

    content.append(icon, title, message, button);
    modal.appendChild(content);
    document.body.appendChild(modal);

    button.addEventListener("click", () => {
        modal.remove();
    });

    setTimeout(() => {
        window.location.href = "./index.html";
    }, 2000);
}

function setupCheckout() {
    const checkoutButton = document.getElementById("checkout-btn");

    if (!checkoutButton) return;

    checkoutButton.addEventListener("click", () => {
        if (!cart.length) {
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