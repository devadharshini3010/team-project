
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("pharmacy-form");
    const message = document.getElementById("registration-message");
    const fileInput = document.getElementById("licence-document");
    const fileName = document.getElementById("file-name");
    const password = document.getElementById("new-password");
    const confirmPassword = document.getElementById("confirm-password");
    const submitButton = form.querySelector(".registration-submit");

    // Display messages inside the page
    function showMessage(text, type) {
        message.textContent = text;
        message.style.display = "block";
        message.style.padding = "14px";
        message.style.marginTop = "18px";
        message.style.borderRadius = "8px";
        message.style.fontSize = "14px";

        if (type === "success") {
            message.style.color = "#15803D";
            message.style.backgroundColor = "#DCFCE7";
        } else {
            message.style.color = "#B91C1C";
            message.style.backgroundColor = "#FEE2E2";
        }
    }

    // Initially hide the message
    message.style.display = "none";

    // Show selected licence document name
    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        if (!file) {
            fileName.textContent = "No document selected.";
            return;
        }

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        const validExtension = /\.(pdf|jpg|jpeg|png)$/i.test(file.name);

        if (!allowedTypes.includes(file.type) || !validExtension) {
            fileInput.value = "";
            fileName.textContent = "No document selected.";
            showMessage("Please upload a PDF, JPG or PNG document.", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            fileInput.value = "";
            fileName.textContent = "No document selected.";
            showMessage("The licence document must be smaller than 5 MB.", "error");
            return;
        }

        fileName.textContent = file.name;
        message.style.display = "none";
    });

    // Show / hide password
    document.querySelectorAll(".password-toggle").forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const icon = button.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
                button.setAttribute("aria-label", "Hide password");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
                button.setAttribute("aria-label", "Show password");
            }
        });
    });

    // Clear password mismatch when the user edits either field
    function checkPasswordMatch() {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match.");
        } else {
            confirmPassword.setCustomValidity("");
        }
    }

    password.addEventListener("input", checkPasswordMatch);
    confirmPassword.addEventListener("input", checkPasswordMatch);

    // Validate registration form
    form.addEventListener("submit", event => {
        event.preventDefault();

        message.style.display = "none";

        // Trim text fields
        form.querySelectorAll(
            'input[type="text"], input[type="email"], input[type="tel"], textarea'
        ).forEach(input => {
            input.value = input.value.trim();
        });

        checkPasswordMatch();

        // Browser validation
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Check phone numbers
        const pharmacyPhone =
            document.getElementById("pharmacy-phone").value;

        const pharmacistPhone =
            document.getElementById("pharmacist-phone").value;

        if (!/^[6-9]\d{9}$/.test(pharmacyPhone)) {
            showMessage("Enter a valid 10-digit pharmacy contact number.", "error");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(pharmacistPhone)) {
            showMessage("Enter a valid 10-digit pharmacist contact number.", "error");
            return;
        }

        // Check PIN code
        const pincode = document.getElementById("pincode").value;

        if (!/^\d{6}$/.test(pincode)) {
            showMessage("Enter a valid 6-digit PIN code.", "error");
            return;
        }

        // Check password match
        if (password.value !== confirmPassword.value) {
            showMessage("Passwords do not match.", "error");
            confirmPassword.focus();
            return;
        }

        // Check licence document
        const file = fileInput.files[0];

        if (!file) {
            showMessage("Please upload your pharmacy licence.", "error");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showMessage("The licence document must be smaller than 5 MB.", "error");
            return;
        }

        // Frontend demonstration only
        submitButton.disabled = true;
        submitButton.innerHTML =
            'Registration details validated <i class="fa-solid fa-check"></i>';

        showMessage(
            "Your registration details have passed frontend validation. Backend submission and pharmacy verification will be connected separately.",
            "success"
        );

        submitButton.disabled = false;
    });
});
