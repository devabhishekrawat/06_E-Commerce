const loginForm = document.querySelector("#login-form");

const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

const loginError = document.querySelector("#login-error");


loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const correctEmail = "admin@example.com";
    const correctPassword = "Admin@123";
    if (email !== correctEmail) {

        loginError.textContent =
            "Email address is incorrect.";

        return;
    }

    if (password !== correctPassword) {

        loginError.textContent =
            "You did not enter the correct password.";

        passwordInput.focus();

        return;
    }


    const user = {
        email: email,
        isLoggedIn: true
    };

    sessionStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    loginError.textContent = "";
    alert("Login successful!");
    window.location.href = "./index.html"
});