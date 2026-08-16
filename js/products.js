import { products1, products2, testimonials } from "./data.js";


const newArrivalsGrid = document.querySelector("#new-arrivals-grid");
const topSellingGrid = document.querySelector("#top-selling-grid");

const newArrivalsBtn = document.querySelector("#new-arrivals-btn");
const topSellingBtn = document.querySelector("#top-selling-btn");


function createStars(rating) {

    const roundedRating = Math.round(rating);

    let stars = "";

    for (let i = 1; i <= 5; i++) {
        if (i <= roundedRating) {
            stars += "★";
        } else {
            stars += "☆";
        }
    }
    return stars;
}


function getAverageRating(reviews) {
    if (!reviews || reviews.length === 0) {
        return 0;
    }

    const total = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    return total / reviews.length;
}

function createProductCard(product) {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.dataset.productId = product.id;
    card.addEventListener("click", () => {
        const userData = sessionStorage.getItem("user");
        let user = null;
        if (userData) {
            user = JSON.parse(userData);
        }
        if (!user || user.isLoggedIn !== true) {
            alert("Please login first to view product details.");
            return;
        }
        window.location.href =
            `productDetail.html?id=${product.id}`;
    });
    const imageWrapper = document.createElement("div");
    imageWrapper.classList.add(
        "product-card__image-wrapper"
    );

    const image = document.createElement("img");
    image.classList.add(
        "product-card__image"
    );
    image.src = product.image;
    image.alt = product.name;
    imageWrapper.appendChild(image);
    const title = document.createElement("h3");
    title.classList.add(
        "product-card__title"
    );
    title.textContent = product.name;
    const averageRating =
        getAverageRating(product.reviews);
    const ratingContainer =
        document.createElement("div");

    ratingContainer.classList.add(
        "product-card__rating"
    );
    const stars =
        document.createElement("span");

    stars.classList.add("stars");

    stars.textContent =
        createStars(averageRating);
    const score =
        document.createElement("span");
    score.classList.add("score");
    score.innerHTML =
        `${averageRating.toFixed(1)}/<small>5</small>`;

    ratingContainer.appendChild(stars);
    ratingContainer.appendChild(score);
    const priceContainer =
        document.createElement("div");
    priceContainer.classList.add(
        "product-card__price"
    );

    if (
        product.originalPrice &&
        product.discount
    ) {
        const currentPrice =
            document.createElement("span");
        currentPrice.classList.add("current");
        currentPrice.textContent =
            `$${product.price}`;

        const originalPrice =
            document.createElement("span");

        originalPrice.classList.add("original");

        originalPrice.textContent =
            `$${product.originalPrice}`;


        const badge =
            document.createElement("span");

        badge.classList.add("badge");

        badge.textContent =
            `-${product.discount}%`;


        priceContainer.appendChild(
            currentPrice
        );

        priceContainer.appendChild(
            originalPrice
        );

        priceContainer.appendChild(
            badge
        );

    } else {

        priceContainer.textContent =
            `$${product.price}`;

    }
    card.appendChild(imageWrapper);
    card.appendChild(title);
    card.appendChild(ratingContainer);
    card.appendChild(priceContainer);
    return card;
}

function renderProducts(
    products,
    grid,
    button
) {

    const initialProducts = 4;

    let showingAll = false;


    function render(count) {

        grid.innerHTML = "";


        const productsToShow =
            products.slice(0, count);


        productsToShow.forEach(product => {

            const productCard =
                createProductCard(product);

            grid.appendChild(productCard);

        });

        if (products.length <= initialProducts) {

            button.style.display = "none";

        } else {

            button.style.display = "block";

        }

    }


    render(initialProducts);


    button.addEventListener("click", () => {

        if (!showingAll) {

            render(products.length);

            button.textContent = "Show Less";

            showingAll = true;

        } else {

            render(initialProducts);

            button.textContent = "View All";

            showingAll = false;

        }

    });

}


document.addEventListener("DOMContentLoaded", () => {
    const banner = document.querySelector(".top-banner");
    const closeButton = document.querySelector(".top-banner__close");

    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user?.isLoggedIn === true) {
        banner.style.display = "none";
        return;
    }

    closeButton.addEventListener("click", () => {
        banner.style.display = "none";
    });
});



renderProducts(
    products1,
    newArrivalsGrid,
    newArrivalsBtn
);


renderProducts(
    products2,
    topSellingGrid,
    topSellingBtn
);