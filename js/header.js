export function cartHeader() {
    const cartButton = document.querySelector(".header__action-btn[aria-label='Cart']");

    if (!cartButton) return;

    const cartIcon = cartButton.querySelector("img");

    if (!cartIcon) return;

    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("cart")) || [];
    } catch (error) {
        cart = [];
    }

    const cartCount = cart.reduce((total, item) => {
        return total + (Number(item.quantity) || 1);
    }, 0);

    const existingBadge = cartButton.querySelector(".cart-count");

    if (existingBadge) {
        existingBadge.remove();
    }

    if (cartCount === 0) return;

    const badge = document.createElement("span");
    badge.className = "cart-count";
    badge.textContent = cartCount > 5 ? "5+" : cartCount;

    cartButton.appendChild(badge);
}