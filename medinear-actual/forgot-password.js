
const forgotForm = document.getElementById("forgot-password-form");

const forgotEmail = document.getElementById("forgot-email");

const forgotMessage = document.getElementById("forgot-message");


forgotForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = forgotEmail.value.trim();

    forgotMessage.className = "forgot-message";
    forgotMessage.textContent = "";


    if (!email) {

        showForgotMessage("Please enter your registered email address.", "error");

        return;
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        showForgotMessage("Please enter a valid email address.", "error");

        return;
    }


    showForgotMessage(
        "Your email address has been validated. Password reset will be available once the backend email service is connected.",
        "success"
    );

});


function showForgotMessage(message, type) {

    forgotMessage.textContent = message;

    forgotMessage.className = `forgot-message ${type}`;

}
