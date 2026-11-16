
/* =====================================
   MEDINEAR CUSTOMER REGISTRATION
   FRONTEND VALIDATION
===================================== */

const registrationForm =
    document.getElementById("customer-register-form");

const registerMessage =
    document.getElementById("register-message");


// PASSWORD VISIBILITY

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", function() {

        const targetId = this.dataset.target;

        const passwordInput = document.getElementById(targetId);

        const icon = this.querySelector("i");

        const isPassword =
            passwordInput.type === "password";

        passwordInput.type =
            isPassword ? "text" : "password";

        icon.classList.toggle("fa-eye", !isPassword);

        icon.classList.toggle("fa-eye-slash", isPassword);

        this.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    });

});


// REGISTRATION FORM VALIDATION

registrationForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const fullName =
        document.getElementById("full-name").value.trim();

    const email =
        document.getElementById("register-email").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const password =
        document.getElementById("register-password").value;

    const confirmPassword =
        document.getElementById("confirm-password").value;

    const termsAccepted =
        document.getElementById("terms").checked;


    registerMessage.className = "register-message";

    registerMessage.textContent = "";


    if (fullName.length < 2) {

        showMessage("Please enter your full name.");

        return;
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        showMessage("Please enter a valid email address.");

        return;
    }


    if (!/^[6-9][0-9]{9}$/.test(mobile)) {

        showMessage("Please enter a valid 10-digit mobile number.");

        return;
    }


    if (password.length < 8) {

        showMessage("Password must contain at least 8 characters.");

        return;
    }


    if (password !== confirmPassword) {

        showMessage("Passwords do not match.");

        return;
    }


    if (!termsAccepted) {

        showMessage("Please accept the Terms and Conditions.");

        return;
    }


    showMessage(
        "Registration details validated successfully. Account creation will be connected to the backend.",
        "success"
    );

});


function showMessage(message, type = "error") {

    registerMessage.textContent = message;

    registerMessage.className =
        `register-message ${type}`;

}
