import { products1, products2, testimonials } from "./data.js";
import { cartHeader } from "./header.js";

const newArrivalsGrid = document.querySelector("#new-arrivals-grid");
const topSellingGrid = document.querySelector("#top-selling-grid");
const newArrivalsBtn = document.querySelector("#new-arrivals-btn");
const topSellingBtn = document.querySelector("#top-selling-btn");

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".header__hamburger");
    const nav = document.querySelector(".header__nav");

    hamburger.addEventListener("click", () => {
        nav.classList.toggle("header__nav--open");
    });

    cartHeader();

    renderProducts(products1, newArrivalsGrid, newArrivalsBtn);
    renderProducts(products2, topSellingGrid, topSellingBtn);
    renderTestimonials();
    setupBanner();
    setupLogout();
});

function createStars(rating, className = "product-card__star-img") {
    const stars = document.createDocumentFragment();
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        const img = document.createElement("img");
        img.src = "./assets/icons/Star.svg";
        img.alt = "Star";
        img.className = className;
        stars.appendChild(img);
    }

    if (halfStar) {
        const img = document.createElement("img");
        img.src = "./assets/icons/halfStar.svg";
        img.alt = "Half Star";
        img.className = className;
        stars.appendChild(img);
    }

    return stars;
}

function getAverageRating(reviews) {
    if (!reviews?.length) return 0;

    const total = reviews.reduce((sum, review) => {
        return sum + review.rating;
    }, 0);

    return Math.floor((total / reviews.length) * 2) / 2;
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.productId = product.id;

    card.addEventListener("click", () => {
        const user = JSON.parse(sessionStorage.getItem("user"));

        if (!user?.isLoggedIn) {
            alert("Please login first to view product details.");
            return;
        }

        window.location.href = `productDetail.html?id=${product.id}`;
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
    stars.appendChild(createStars(rating));

    const score = document.createElement("span");
    score.className = "score";
    score.append(`${rating.toFixed(1)}/`);

    const five = document.createElement("small");
    five.textContent = "5";
    score.appendChild(five);

    ratingContainer.append(stars, score);

    const priceContainer = document.createElement("div");
    priceContainer.className = "product-card__price";

    if (product.originalPrice && product.discount) {
        const currentPrice = document.createElement("span");
        currentPrice.className = "current";
        currentPrice.textContent = `$${product.price}`;

        const originalPrice = document.createElement("span");
        originalPrice.className = "original";
        originalPrice.textContent = `$${product.originalPrice}`;

        const badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = `-${product.discount}%`;

        priceContainer.append(currentPrice, originalPrice, badge);
    } else {
        priceContainer.textContent = `$${product.price}`;
    }

    card.append(
        imageWrapper,
        title,
        ratingContainer,
        priceContainer
    );

    return card;
}

function renderProducts(products, grid, button) {
    const firstFour = 4;
    let showingAll = false;

    function render(count) {
        grid.replaceChildren();

        products.slice(0, count).forEach(product => {
            grid.appendChild(createProductCard(product));
        });

        button.style.display =
            products.length <= firstFour ? "none" : "block";
    }

    render(firstFour);

    button.addEventListener("click", () => {
        showingAll = !showingAll;

        if (showingAll) {
            render(products.length);
            button.textContent = "Show Less";
        } else {
            render(firstFour);
            button.textContent = "View All";
        }
    });
}

function setupBanner() {
    const banner = document.querySelector(".top-banner");
    const closeButton = document.querySelector(".top-banner__close");
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user?.isLoggedIn) {
        banner.style.display = "none";
        return;
    }

    closeButton.addEventListener("click", () => {
        banner.style.display = "none";
    });
}

function setupLogout() {
    const logoutBtn = document.querySelector(".header__logout-btn");

    logoutBtn?.addEventListener("click", () => {
        sessionStorage.removeItem("user");
        window.location.href = "./login.html";
    });
}

function renderTestimonials() {
    const track = document.querySelector(".testimonials__track");

    if (!track) return;

    track.replaceChildren();

    testimonials.forEach(testimonial => {
        const card = document.createElement("div");
        card.className = "testimonial-card";

        const stars = document.createElement("div");
        stars.className = "testimonial-card__stars";
        stars.appendChild(
            createStars(
                testimonial.rating,
                "testimonial-card__star-img"
            )
        );

        const author = document.createElement("div");
        author.className = "testimonial-card__author";

        const name = document.createElement("span");
        name.className = "name";
        name.textContent = testimonial.name;

        const verified = document.createElement("span");
        verified.className = "verified-icon";
        verified.textContent = "✓";

        author.append(name, verified);

        const text = document.createElement("p");
        text.className = "testimonial-card__text";
        text.textContent = `"${testimonial.feedback}"`;

        card.append(stars, author, text);
        track.appendChild(card);
    });
}