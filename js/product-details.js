import { products1, products2 } from "./data.js";
import { cartHeader } from "./header.js";

const user = JSON.parse(sessionStorage.getItem("user"));

if (!user?.isLoggedIn) {
    window.location.href = "./login.html";
}

const allProducts = [...products1, ...products2];
const productId = new URLSearchParams(window.location.search).get("id");

const newArrivalsGrid = document.querySelector("#new-arrivals-grid");
const newArrivalsBtn = document.querySelector("#new-arrivals-btn");

document.addEventListener("DOMContentLoaded", () => {
    setupBanner();
    cartHeader();

    const product = allProducts.find(
        item => String(item.id) === String(productId)
    ) || allProducts[0];

    if (!product) return;

    renderProductDetails(product);

    if (newArrivalsGrid && newArrivalsBtn) {
        renderProducts(products1, newArrivalsGrid, newArrivalsBtn);
    }
});

function setupBanner() {
    const banner = document.querySelector(".top-banner");
    const closeButton = document.querySelector(".top-banner__close");

    if (!banner) return;

    const currentUser = JSON.parse(sessionStorage.getItem("user"));

    if (currentUser?.isLoggedIn) {
        banner.style.display = "none";
        return;
    }

    closeButton?.addEventListener("click", () => {
        banner.style.display = "none";
    });
}

function renderProductDetails(product) {
    const title = document.querySelector(".product-detail__title");
    const description = document.querySelector(".product-detail__desc");

    if (title) title.textContent = product.name;
    if (description) description.textContent = product.description;

    const rating = getAverageRating(product.reviews);

    const ratingScore = document.querySelector(
        ".product-detail__rating-score"
    );

    if (ratingScore) {
        ratingScore.textContent = `${rating}/5`;
    }

    renderStars(
        rating,
        document.querySelector(".product-detail__stars"),
        "product-detail__star star-icon"
    );

    setPrice(product);
    setupGallery(product);
    setupQuantity();
    setupSelection(".color-option", "color-option--selected");
    setupSelection(".size-btn", "size-btn--selected");
    setupAddToCart(product);
    renderReviewsSection(product.reviews || []);
}

function getAverageRating(reviews) {
    if (!Array.isArray(reviews) || !reviews.length) {
        return 0;
    }

    const total = reviews.reduce((sum, review) => {
        return sum + Number(review.rating || 0);
    }, 0);

    return Math.floor((total / reviews.length) * 2) / 2;
}

function renderStars(rating, container, className) {
    if (!container) return;

    container.replaceChildren();

    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        container.appendChild(createStar(className, "Star"));
    }

    if (halfStar) {
        container.appendChild(
            createStar(className, "Half Star", true)
        );
    }
}

function createStar(className, alt, half = false) {
    const img = document.createElement("img");

    img.src = half
        ? "./assets/icons/halfStar.svg"
        : "./assets/icons/Star.svg";

    img.alt = alt;
    img.className = className;

    return img;
}

function setPrice(product) {
    const currentPrice = document.querySelector(".price-current");
    const originalPrice = document.querySelector(".price-original");
    const discount = document.querySelector(".price-discount");

    if (currentPrice) {
        currentPrice.textContent = `$${product.price}`;
    }

    if (originalPrice) {
        originalPrice.style.display = product.originalPrice
            ? "inline"
            : "none";

        if (product.originalPrice) {
            originalPrice.textContent = `$${product.originalPrice}`;
        }
    }

    if (discount) {
        discount.style.display = product.discount
            ? "inline"
            : "none";

        if (product.discount) {
            discount.textContent = `-${product.discount}%`;
        }
    }
}

function setupGallery(product) {
    const mainImage = document.querySelector(
        ".product-gallery__main-image"
    );

    const thumbnails = document.querySelector(
        ".product-gallery__thumbnails"
    );

    const images = product.images?.length
        ? product.images
        : [product.image, product.image, product.image];

    if (mainImage) {
        mainImage.src = images[0] || "";
        mainImage.alt = product.name || "Product";
    }

    if (!thumbnails) return;

    thumbnails.replaceChildren();

    images.forEach((imageSrc, index) => {
        const thumb = document.createElement("div");
        thumb.className = "product-gallery__thumb";

        if (index === 0) {
            thumb.classList.add(
                "product-gallery__thumb--active"
            );
        }

        const image = document.createElement("img");
        image.className = "product-gallery__thumb-image";
        image.src = imageSrc || "";
        image.alt = `Thumbnail ${index + 1}`;

        thumb.appendChild(image);
        thumbnails.appendChild(thumb);

        thumb.addEventListener("click", () => {
            document
                .querySelectorAll(".product-gallery__thumb")
                .forEach(item => {
                    item.classList.remove(
                        "product-gallery__thumb--active"
                    );
                });

            thumb.classList.add(
                "product-gallery__thumb--active"
            );

            if (mainImage) {
                mainImage.src = images[index] || "";
            }
        });
    });
}

function setupQuantity() {
    let quantity = 1;

    const quantityValue = document.querySelector(".qty-val");
    const minusButton = document.querySelector(".btn-minus");
    const plusButton = document.querySelector(".btn-plus");

    minusButton?.addEventListener("click", () => {
        if (quantity <= 1) return;

        quantity--;
        quantityValue.textContent = quantity;
    });

    plusButton?.addEventListener("click", () => {
        quantity++;
        quantityValue.textContent = quantity;
    });

    return () => quantity;
}

function setupSelection(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(element => {
        element.addEventListener("click", () => {
            elements.forEach(item => {
                item.classList.remove(activeClass);
            });

            element.classList.add(activeClass);
        });
    });
}

function setupAddToCart(product) {
    const button = document.querySelector(".add-to-cart-btn");
    const quantityValue = document.querySelector(".qty-val");

    button?.addEventListener("click", () => {
        const selectedSize = document.querySelector(
            ".size-btn--selected"
        );

        const selectedColor = document.querySelector(
            ".color-option--selected"
        );

        const cartItem = {
            productId: product.id,
            productName: product.name,
            quantity: Number(quantityValue?.textContent || 1),
            size: selectedSize?.dataset.size ||
                selectedSize?.textContent.trim() ||
                "",
            color: selectedColor?.getAttribute("aria-label") || "",
            image: product.image,
            price: product.price
        };

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        cart.push(cartItem);

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("Product added to cart!");
    });
}

function renderReviewsSection(reviews) {
    const count = document.querySelector(".reviews-section__count");
    const grid = document.querySelector(".reviews-section__grid");

    if (count) {
        count.textContent = `(${reviews.length})`;
    }

    if (!grid) return;

    grid.replaceChildren();

    if (!reviews.length) {
        const message = document.createElement("p");
        message.className = "reviews-section__empty";
        message.textContent = "No reviews yet for this product.";

        grid.appendChild(message);
        return;
    }

    reviews.forEach(review => {
        const card = document.createElement("article");
        card.className = "review-card";

        const header = document.createElement("div");
        header.className = "review-card__header";

        const stars = document.createElement("div");
        stars.className = "review-card__stars";

        renderStars(
            Number(review.rating || 0),
            stars,
            "review-card__star star-icon"
        );

        const moreButton = document.createElement("button");
        moreButton.className = "review-card__more-btn";
        moreButton.setAttribute("aria-label", "More options");
        moreButton.textContent = "•••";

        header.append(stars, moreButton);

        const user = document.createElement("div");
        user.className = "review-card__user";
        user.textContent = review.user || "Anonymous";

        const badge = document.createElement("span");
        badge.className = "review-card__badge";
        badge.textContent = "✓";

        user.appendChild(badge);

        const message = document.createElement("p");
        message.className = "review-card__message";
        message.textContent = `"${review.message || ""}"`;

        const date = document.createElement("span");
        date.className = "review-card__date";
        date.textContent = `Posted on ${formatDate(review.date)}`;

        card.append(header, user, message, date);
        grid.appendChild(card);
    });
}

function formatDate(date) {
    if (!date) return "Posted recently";

    return new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;

    card.addEventListener("click", () => {
        const currentUser = JSON.parse(
            sessionStorage.getItem("user")
        );

        if (!currentUser?.isLoggedIn) {
            alert("Please login first to view product details.");
            return;
        }

        window.location.href =
            `productDetail.html?id=${product.id}`;
    });

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "product-card__image-wrapper";

    const image = document.createElement("img");
    image.className = "product-card__image";
    image.src = product.image;
    image.alt = product.name;

    imageWrapper.appendChild(image);

    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.name;

    const rating = getAverageRating(product.reviews);

    const ratingContainer = document.createElement("div");
    ratingContainer.className = "product-card__rating";

    const stars = document.createElement("span");
    stars.className = "stars";

    renderStars(
        rating,
        stars,
        "product-card__star-img"
    );

    const score = document.createElement("span");
    score.className = "score";
    score.append(`${rating.toFixed(1)}/`);

    const five = document.createElement("small");
    five.textContent = "5";

    score.appendChild(five);
    ratingContainer.append(stars, score);

    const price = document.createElement("div");
    price.className = "product-card__price";

    const currentPrice = document.createElement("span");
    currentPrice.className = "current";
    currentPrice.textContent = `$${product.price}`;

    price.appendChild(currentPrice);

    if (product.originalPrice && product.discount) {
        const originalPrice = document.createElement("span");
        originalPrice.className = "original";
        originalPrice.textContent = `$${product.originalPrice}`;

        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = `-${product.discount}%`;

        price.append(originalPrice, badge);
    }

    card.append(
        imageWrapper,
        title,
        ratingContainer,
        price
    );

    return card;
}

function renderProducts(products, grid, button) {
    const firstProducts = 4;
    let showingAll = false;

    function render(count) {
        grid.replaceChildren();

        products.slice(0, count).forEach(product => {
            grid.appendChild(createProductCard(product));
        });

        button.style.display =
            products.length <= firstProducts ? "none" : "block";
    }

    render(firstProducts);

    button.addEventListener("click", () => {
        showingAll = !showingAll;

        if (showingAll) {
            render(products.length);
            button.textContent = "Show Less";
        } else {
            render(firstProducts);
            button.textContent = "View All";
        }
    });
}