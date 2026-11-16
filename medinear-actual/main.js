
const searchForm = document.getElementById("medicine-search");

searchForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const medicine = document
        .getElementById("medicine")
        .value.trim();

    const area = document
        .getElementById("area")
        .value.trim();

    if (!medicine || !area) {
        alert("Please enter a medicine and your area.");
        return;
    }

    alert(
        `Searching for ${medicine} near ${area}.\n\n` +
        "The pharmacy availability feature will be connected soon."
    );

});
