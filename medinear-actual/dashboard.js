
/* =========================================
   MEDINEAR - ADD MEDICINE FUNCTIONALITY
   Frontend demonstration only
========================================= */

const medicineModal = document.getElementById("medicineModal");
const medicineForm = document.getElementById("medicineForm");

const addMedicineBtn = document.getElementById("addMedicineBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const closeMedicineModal = document.getElementById("closeMedicineModal");
const cancelMedicine = document.getElementById("cancelMedicine");

const tableBody = document.getElementById("inventoryTableBody");
const searchInput = document.getElementById("inventorySearch");
const stockFilter = document.getElementById("stockFilter");

const formMessage = document.getElementById("medicineFormMessage");

let medicines = [];


/* =========================================
   OPEN AND CLOSE MODAL
========================================= */

function openMedicineModal() {
    medicineModal.classList.add("show");
    formMessage.className = "form-message";
    formMessage.textContent = "";
}

function closeModal() {
    medicineModal.classList.remove("show");
    medicineForm.reset();

    formMessage.className = "form-message";
    formMessage.textContent = "";
}

addMedicineBtn.addEventListener("click", openMedicineModal);
emptyAddBtn.addEventListener("click", openMedicineModal);

closeMedicineModal.addEventListener("click", closeModal);
cancelMedicine.addEventListener("click", closeModal);

medicineModal.addEventListener("click", function (event) {
    if (event.target === medicineModal) {
        closeModal();
    }
});


/* =========================================
   GET STOCK STATUS
========================================= */

function getStockStatus(medicine) {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(medicine.expiryDate + "T00:00:00");

    if (expiry < today) {
        return "Expired";
    }

    if (medicine.quantity === 0) {
        return "Out of Stock";
    }

    if (medicine.quantity <= 10) {
        return "Low Stock";
    }

    return "Available";
}


/* =========================================
   ADD MEDICINE
========================================= */

medicineForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const medicine = {

        id: Date.now(),

        name: document.getElementById("medicineName").value.trim(),

        brand: document.getElementById("brandName").value.trim(),

        composition: document.getElementById("composition").value.trim(),

        strength: document.getElementById("strength").value.trim(),

        dosageForm: document.getElementById("dosageForm").value,

        batchNumber: document.getElementById("batchNumber").value.trim(),

        expiryDate: document.getElementById("expiryDate").value,

        quantity: Number(document.getElementById("quantity").value),

        price: Number(document.getElementById("medicinePrice").value)

    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(medicine.expiryDate + "T00:00:00");

    if (expiry < today) {
        showMessage("Expired batches cannot be added as available stock.", "error");
        return;
    }

    if (
        !medicine.name ||
        !medicine.brand ||
        !medicine.composition ||
        !medicine.strength ||
        !medicine.dosageForm ||
        !medicine.batchNumber ||
        !medicine.expiryDate ||
        !Number.isInteger(medicine.quantity) ||
        medicine.quantity < 0 ||
        !Number.isFinite(medicine.price) ||
        medicine.price < 0
    ) {
        showMessage("Please enter valid information in all required fields.", "error");
        return;
    }

    medicines.push(medicine);

    renderInventory();

    medicineForm.reset();

    showMessage("Medicine added to the demonstration inventory.", "success");

    setTimeout(function () {
        closeModal();
    }, 900);

});


/* =========================================
   DISPLAY FORM MESSAGES
========================================= */

function showMessage(message, type) {

    formMessage.textContent = message;
    formMessage.className = "form-message " + type;

}


/* =========================================
   DISPLAY INVENTORY
========================================= */

function renderInventory() {

    const searchText = searchInput.value.toLowerCase();
    const filterValue = stockFilter.value;

    tableBody.innerHTML = "";

    const filteredMedicines = medicines.filter(function (medicine) {

        const matchesSearch =
            medicine.name.toLowerCase().includes(searchText) ||
            medicine.composition.toLowerCase().includes(searchText) ||
            medicine.brand.toLowerCase().includes(searchText);

        const status = getStockStatus(medicine);

        let matchesFilter = true;

        if (filterValue === "available") {
            matchesFilter = status === "Available";
        }

        if (filterValue === "low") {
            matchesFilter = status === "Low Stock";
        }

        if (filterValue === "out") {
            matchesFilter =
                status === "Out of Stock" || status === "Expired";
        }

        return matchesSearch && matchesFilter;

    });


    if (filteredMedicines.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="empty-state">
                        <i class="fa-solid fa-box-open"></i>
                        <h3>No matching medicines found</h3>
                        <p>Try another search or add a medicine.</p>
                    </div>
                </td>
            </tr>
        `;

    } else {

        filteredMedicines.forEach(function (medicine) {

            const status = getStockStatus(medicine);

            let statusClass = "available-status";

            if (status === "Low Stock") {
                statusClass = "low-status";
            }

            if (status === "Out of Stock") {
                statusClass = "out-status";
            }

            if (status === "Expired") {
                statusClass = "out-status";
            }

            const row = document.createElement("tr");

            const values = [
                medicine.name + " (" + medicine.brand + ")",
                medicine.composition,
                medicine.strength,
                medicine.dosageForm,
                medicine.quantity,
                "₹" + medicine.price.toFixed(2),
                formatDate(medicine.expiryDate),
                status
            ];

            values.forEach(function (value, index) {

                const cell = document.createElement("td");

                if (index === 7) {

                    const badge = document.createElement("span");
                    badge.className = "stock-status " + statusClass;
                    badge.textContent = value;
                    cell.appendChild(badge);

                } else {

                    cell.textContent = value;

                }

                row.appendChild(cell);

            });

            const actionCell = document.createElement("td");
            actionCell.textContent = "Batch: " + medicine.batchNumber;

            row.appendChild(actionCell);

            tableBody.appendChild(row);

        });

    }

    updateOverview();

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric"
    });

}


/* =========================================
   UPDATE DASHBOARD NUMBERS
========================================= */

function updateOverview() {

    const validMedicines = medicines.filter(function (medicine) {
        return getStockStatus(medicine) !== "Expired";
    });

    const available = validMedicines.filter(function (medicine) {
        return getStockStatus(medicine) === "Available";
    });

    const low = validMedicines.filter(function (medicine) {
        return getStockStatus(medicine) === "Low Stock";
    });

    const expiring = validMedicines.filter(function (medicine) {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiry = new Date(medicine.expiryDate + "T00:00:00");

        const daysRemaining = (expiry - today) / (1000 * 60 * 60 * 24);

        return daysRemaining >= 0 && daysRemaining <= 90;

    });

    document.getElementById("totalMedicines").textContent = medicines.length;

    document.getElementById("availableStock").textContent = available.length;

    document.getElementById("lowStock").textContent = low.length;

    document.getElementById("expiringBatches").textContent = expiring.length;

}


/* =========================================
   SEARCH AND FILTER
========================================= */

searchInput.addEventListener("input", renderInventory);

stockFilter.addEventListener("change", renderInventory);


/* =========================================
   INITIAL DISPLAY
========================================= */

renderInventory();
