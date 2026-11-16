
/* =========================================
   MEDINEAR AUTHENTICATION
   Frontend interactions and validation
========================================= */


/* -----------------------------------------
   THEME SWITCHER
----------------------------------------- */

(function setupTheme() {

    const savedTheme = localStorage.getItem("medinear-theme") || "light";

    document.documentElement.setAttribute("data-theme", savedTheme);

    const themeButton = document.createElement("button");

    themeButton.type = "button";
    themeButton.className = "theme-switch";
    themeButton.setAttribute("aria-label", "Toggle colour theme");

    themeButton.innerHTML = savedTheme === "dark"
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

    Object.assign(themeButton.style, {
        position: "fixed",
        bottom: "22px",
        right: "22px",
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--primary-deep)",
        fontSize: "17px",
        boxShadow: "var(--shadow)",
        zIndex: "1000"
    });

    document.body.appendChild(themeButton);

    themeButton.addEventListener("click", () => {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);

        localStorage.setItem("medinear-theme", newTheme);

        themeButton.innerHTML = newTheme === "dark"
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';

    });

})();


/* -----------------------------------------
   PASSWORD VISIBILITY
----------------------------------------- */

document.querySelectorAll(".password-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const input = document.getElementById(
            button.dataset.target
        );

        if (!input) return;

        const isPassword = input.type === "password";

        input.type = isPassword ? "text" : "password";

        button.innerHTML = isPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

        button.setAttribute(
            "aria-label",
            isPassword ? "Hide password" : "Show password"
        );

    });

});


/* -----------------------------------------
   LOGIN ACCOUNT TYPE SELECTION
----------------------------------------- */

const accountOptions =
    document.querySelectorAll(".account-option");

const accountRole =
    document.getElementById("account-role");

accountOptions.forEach(option => {

    option.addEventListener("click", () => {

        accountOptions.forEach(item => {
            item.classList.remove("active");
        });

        option.classList.add("active");

        accountRole.value = option.dataset.role;

    });

});


/* -----------------------------------------
   MESSAGE HELPER
----------------------------------------- */

function showMessage(element, message, type) {

    if (!element) return;

    element.textContent = message;

    element.className = "form-message " + type;

}


/* -----------------------------------------
   LOGIN FORM
----------------------------------------- */

const loginForm = document.getElementById("login-form");

if (loginForm) {

    const loginMessage =
        document.getElementById("login-message");

    loginForm.addEventListener("submit", event => {

        event.preventDefault();

        const email =
            document.getElementById("login-email").value.trim();

        const password =
            document.getElementById("login-password").value;

        const role = accountRole.value;

        if (!email || !password) {

            showMessage(
                loginMessage,
                "Please complete all required fields.",
                "error"
            );

            return;

        }

        if (password.length < 8) {

            showMessage(
                loginMessage,
                "Password must contain at least 8 characters.",
                "error"
            );

            return;

        }

        if (role === "pharmacist") {

    window.location.href = "pharmacist-dashboard.html";

} else if (role === "customer") {

    window.location.href = "index.html";

}

});
}


/* -----------------------------------------
   FORGOT PASSWORD
----------------------------------------- */

const forgotPassword =
    document.getElementById("forgot-password");

if (forgotPassword) {

    forgotPassword.addEventListener("click", event => {

        event.preventDefault();

        alert(
            "Password recovery will be available after backend integration."
        );

    });

}


/* -----------------------------------------
   CUSTOMER REGISTRATION PLACEHOLDER
----------------------------------------- */

const customerRegister =
    document.getElementById("customer-register");

if (customerRegister) {

    customerRegister.addEventListener("click", event => {

        event.preventDefault();

        alert(
            "Customer registration page will be developed separately."
        );

    });

}


/* -----------------------------------------
   LICENCE DOCUMENT UPLOAD
----------------------------------------- */

const licenceInput =
    document.getElementById("licence-document");

const fileName =
    document.getElementById("file-name");

if (licenceInput) {

    licenceInput.addEventListener("change", () => {

        const file = licenceInput.files[0];

        if (!file) {

            fileName.textContent = "No document selected.";

            return;

        }

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(file.type)) {

            licenceInput.value = "";

            fileName.textContent = "Unsupported file format.";

            alert("Please upload a PDF, JPG or PNG document.");

            return;

        }

        if (file.size > maxSize) {

            licenceInput.value = "";

            fileName.textContent = "File exceeds 5 MB.";

            alert("Document size must not exceed 5 MB.");

            return;

        }

        fileName.textContent = "Selected: " + file.name;

    });

}


/* -----------------------------------------
   PHARMACY REGISTRATION
----------------------------------------- */

const pharmacyForm =
    document.getElementById("pharmacy-form");

if (pharmacyForm) {

    const registrationMessage =
        document.getElementById("registration-message");

    pharmacyForm.addEventListener("submit", event => {

        event.preventDefault();

        if (!pharmacyForm.checkValidity()) {

            pharmacyForm.reportValidity();

            return;

        }

        const password =
            document.getElementById("new-password").value;

        const confirmPassword =
            document.getElementById("confirm-password").value;

        const licence =
            document.getElementById("licence-document").files[0];

        const pharmacistPhone =
            document.getElementById("pharmacist-phone").value.trim();

        const pharmacyPhone =
            document.getElementById("pharmacy-phone").value.trim();

        const pinCode =
            document.getElementById("pincode").value.trim();


        // Password validation

        if (password.length < 8) {

            showMessage(
                registrationMessage,
                "Password must contain at least 8 characters.",
                "error"
            );

            return;

        }


        // Confirm password

        if (password !== confirmPassword) {

            showMessage(
                registrationMessage,
                "Passwords do not match. Please check again.",
                "error"
            );

            return;

        }


        // Phone validation

        const phonePattern = /^[6-9]\d{9}$/;

        if (
            !phonePattern.test(pharmacyPhone) ||
            !phonePattern.test(pharmacistPhone)
        ) {

            showMessage(
                registrationMessage,
                "Please enter valid 10-digit Indian mobile numbers.",
                "error"
            );

            return;

        }


        // PIN code validation

        if (!/^\d{6}$/.test(pinCode)) {

            showMessage(
                registrationMessage,
                "Please enter a valid 6-digit PIN code.",
                "error"
            );

            return;

        }


        // Document validation

        if (!licence) {

            showMessage(
                registrationMessage,
                "Please upload the pharmacy licence.",
                "error"
            );

            return;

        }


        // Frontend-only demonstration.
        // The backend must perform real document checks,
        // secure storage and administrative approval.

        showMessage(
            registrationMessage,
            "Registration details passed initial form validation. " +
            "Backend submission and licence verification are not yet connected. " +
            "The pharmacy must be reviewed and approved by an administrator " +
            "before appearing in customer searches.",
            "success"
        );

        registrationMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

}
