import { products1, products2, testimonials } from "./data.js";

const allProducts = [...products1, ...products2];
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
console.log(productId)

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
    const product = allProducts.find((p) => String(p.id) === String(productId)) || allProducts[0];

    if (product) {
        renderProductDetails(product);
    }
});

function renderProductDetails(product) {
    document.querySelector(".product-detail__title").textContent =
        product.name || product.title || "ONE LIFE GRAPHIC T-SHIRT";

    document.querySelector(".product-detail__desc").textContent =
        product.description || "This graphic t-shirt is perfect for any occasion.";

    let avgRating = 0;
    if (Array.isArray(product.reviews) && product.reviews.length > 0) {
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        avgRating = (totalRating / product.reviews.length).toFixed(1);
    }

    document.querySelector(".rating-score").textContent = `${avgRating}/5`;
    renderStars(Number(avgRating));

    document.querySelector(".price-current").textContent = `$${product.price}`;

    const originalPriceEl = document.querySelector(".price-original");
    const discountEl = document.querySelector(".price-discount");

    if (product.originalPrice) {
        originalPriceEl.textContent = `$${product.originalPrice}`;
        originalPriceEl.style.display = "inline";
    } else {
        originalPriceEl.style.display = "none";
    }

    if (product.discount) {
        discountEl.textContent = `-${product.discount}%`;
        discountEl.style.display = "inline";
    } else {
        discountEl.style.display = "none";
    }

    const mainImage = document.querySelector(".product-gallery__main-img");
    const thumbsContainer = document.querySelector(".product-gallery__thumbnails");

    const images = product.images || [product.image, product.image, product.image];
    mainImage.src = images[0] || "";

    thumbsContainer.innerHTML = images.map((imgSrc, idx) => `
    <div class="product-gallery__thumb ${idx === 0 ? 'product-gallery__thumb--active' : ''}">
      <img src="${imgSrc}" alt="Thumbnail ${idx + 1}">
    </div>
  `).join("");

    document.querySelectorAll(".product-gallery__thumb").forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            document.querySelectorAll(".product-gallery__thumb").forEach((t) => t.classList.remove("product-gallery__thumb--active"));
            thumb.classList.add("product-gallery__thumb--active");
            mainImage.src = images[index];
        });
    });

    let quantity = 1;
    const qtyVal = document.querySelector(".qty-val");

    document.querySelector(".btn-minus")?.addEventListener("click", () => {
        if (quantity > 1) {
            quantity--;
            qtyVal.textContent = quantity;
        }
    });

    document.querySelector(".btn-plus")?.addEventListener("click", () => {
        quantity++;
        qtyVal.textContent = quantity;
    });

    setupSelection(".color-option", "color-option--selected");
    setupSelection(".size-btn", "size-btn--selected");

    // cart onclick
    const addToCartBtn = document.querySelector(".add-to-cart-btn");

    addToCartBtn?.addEventListener("click", () => {
        const selectedSize = document.querySelector(".size-btn--selected");
        const selectedColor = document.querySelector(".color-option--selected");
        const cartItem = {
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            size: selectedSize?.textContent.trim() || "",
            color: selectedColor?.getAttribute("aria-label") || ""
        };

        const cart = JSON.parse(
            localStorage.getItem("cart")
        ) || [];

        cart.push(cartItem);

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );

        alert("Product added to cart!");
    });

    renderReviewsSection(product.reviews || []);
}

function renderStars(rating) {
    const starsContainer = document.querySelector(".product-detail__rating .stars");
    if (!starsContainer) return;

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let starsHTML = "";

    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<img src="../assets/icons/Star.svg" alt="Full Star" class="star-icon">`;
    }
    if (hasHalfStar) {
        starsHTML += `<img src="../assets/icons/halfStar.svg" alt="Half Star" class="star-icon">`;
    }

    starsContainer.innerHTML = starsHTML;
}

function setupSelection(selector, activeClass) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
        el.addEventListener("click", () => {
            elements.forEach((item) => item.classList.remove(activeClass));
            el.classList.add(activeClass);
        });
    });
}


function renderReviewsSection(reviews) {
    const countEl = document.querySelector(".reviews-section__count");
    const gridContainer = document.querySelector(".reviews-section__grid");

    if (countEl) countEl.textContent = `(${reviews.length})`;
    if (!gridContainer) return;

    if (reviews.length === 0) {
        gridContainer.innerHTML = `<p class="reviews-section__empty">No reviews yet for this product.</p>`;
        return;
    }

    gridContainer.innerHTML = reviews.map((review) => {
        const formattedDate = review.date
            ? new Date(review.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : "Posted recently";

        return `
      <article class="review-card">
        <div class="review-card__header">
          <div class="review-card__stars">
            ${generateStarIcons(review.rating)}
          </div>
          <button class="review-card__more-btn" aria-label="More options">•••</button>
        </div>
        <div class="review-card__user">
          ${review.user || "Anonymous"}
          <span class="review-card__badge">✓</span>
        </div>
        <p class="review-card__message">"${review.message || ""}"</p>
        <span class="review-card__date">Posted on ${formattedDate}</span>
      </article>
    `;
    }).join("");
}

function generateStarIcons(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let html = "";

    for (let i = 0; i < fullStars; i++) {
        html += `<img src="../assets/icons/Star.svg" alt="Star" class="star-icon">`;
    }
    if (hasHalfStar) {
        html += `<img src="../assets/icons/halfStar.svg" alt="Half Star" class="star-icon">`;
    }

    return html;
}