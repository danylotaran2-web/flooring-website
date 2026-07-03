const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");

const ADMIN_PASSWORD = "Danilo2026";

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = passwordInput.value;

    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem("daniloAdminLoggedIn", "true");

        window.location.href = "manager.html";
    } else {
        loginError.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
    }
});