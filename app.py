
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

app = Flask(__name__)
CORS(app)

# --------------------------------
# TEMPORARY DEMO DATABASE
# Replace with your teammate's DB
# --------------------------------

categories = [
    "Fever",
    "Pain Relief",
    "Allergy",
    "General Health"
]

pharmacies = [
    {
        "id": 1,
        "name": "City Medicals",
        "area": "Chennai",
        "address": "Main Road, Chennai",
        "phone": "9876543210",
        "medicines": [
            {
                "name": "Paracetamol",
                "composition": "Paracetamol",
                "category": "Fever",
                "price": 20,
                "quantity": 50,
                "expiry": "2027-12-31"
            },
            {
                "name": "Cetirizine",
                "composition": "Cetirizine",
                "category": "Allergy",
                "price": 15,
                "quantity": 30,
                "expiry": "2027-10-31"
            }
        ]
    },
    {
        "id": 2,
        "name": "Health Plus Pharmacy",
        "area": "Tambaram",
        "address": "West Tambaram, Chennai",
        "phone": "9876543211",
        "medicines": [
            {
                "name": "Paracetamol",
                "composition": "Paracetamol",
                "category": "Fever",
                "price": 18,
                "quantity": 25,
                "expiry": "2027-09-30"
            },
            {
                "name": "Ibuprofen",
                "composition": "Ibuprofen",
                "category": "Pain Relief",
                "price": 30,
                "quantity": 0,
                "expiry": "2027-11-30"
            }
        ]
    }
]

users = {}
tokens = {}


# --------------------------------
# 1. HOME API
# --------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Welcome to MediNear Backend",
        "status": "Running"
    })


# --------------------------------
# 2. HEALTH CHECK API
# --------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Backend is working"
    })


# --------------------------------
# 3. GET MEDICINE CATEGORIES
# --------------------------------

@app.route("/api/categories", methods=["GET"])
def get_categories():
    return jsonify({
        "status": "success",
        "categories": categories
    })


# --------------------------------
# 4. SEARCH MEDICINES
# --------------------------------

@app.route("/api/search", methods=["POST"])
def search_medicine():

    data = request.get_json(silent=True) or {}

    medicine = data.get("medicine", "").strip().lower()
    area = data.get("area", "").strip().lower()
    category = data.get("category", "").strip().lower()

    if not medicine and not category:
        return jsonify({
            "status": "error",
            "message": "Enter a medicine name or select a category"
        }), 400

    results = []

    for pharmacy in pharmacies:

        if area and area not in pharmacy["area"].lower():
            continue

        for item in pharmacy["medicines"]:

            name = item["name"].lower()
            composition = item["composition"].lower()
            item_category = item["category"].lower()

            medicine_match = (
                medicine in name or
                medicine in composition
            ) if medicine else False

            category_match = (
                category == item_category
            ) if category else False

            if medicine_match or category_match:

                results.append({
                    "pharmacy_id": pharmacy["id"],
                    "pharmacy_name": pharmacy["name"],
                    "area": pharmacy["area"],
                    "address": pharmacy["address"],
                    "phone": pharmacy["phone"],
                    "medicine": item["name"],
                    "composition": item["composition"],
                    "category": item["category"],
                    "price": item["price"],
                    "quantity": item["quantity"],
                    "available": item["quantity"] > 0,
                    "expiry": item["expiry"]
                })

    results.sort(key=lambda x: x["price"])

    return jsonify({
        "status": "success",
        "count": len(results),
        "results": results
    })


# --------------------------------
# 5. GET PHARMACY DETAILS
# --------------------------------

@app.route("/api/pharmacies", methods=["GET"])
def get_pharmacies():

    area = request.args.get("area", "").lower()

    results = []

    for pharmacy in pharmacies:

        if area and area not in pharmacy["area"].lower():
            continue

        results.append({
            "id": pharmacy["id"],
            "name": pharmacy["name"],
            "area": pharmacy["area"],
            "address": pharmacy["address"],
            "phone": pharmacy["phone"]
        })

    return jsonify({
        "status": "success",
        "pharmacies": results
    })


# --------------------------------
# 6. REGISTER PHARMACY
# --------------------------------

@app.route("/api/pharmacies/register", methods=["POST"])
def register_pharmacy():

    data = request.get_json(silent=True) or {}

    required = ["name", "area", "address", "phone"]

    for field in required:
        if not data.get(field):
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    new_pharmacy = {
        "id": max([p["id"] for p in pharmacies], default=0) + 1,
        "name": data["name"].strip(),
        "area": data["area"].strip(),
        "address": data["address"].strip(),
        "phone": data["phone"].strip(),
        "medicines": []
    }

    pharmacies.append(new_pharmacy)

    return jsonify({
        "status": "success",
        "message": "Pharmacy registered successfully",
        "pharmacy": new_pharmacy
    }), 201


# --------------------------------
# 7. PHARMACIST LOGIN
# --------------------------------

@app.route("/api/auth/register", methods=["POST"])
def register_user():

    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or len(password) < 8:
        return jsonify({
            "status": "error",
            "message": "Valid email and password of at least 8 characters required"
        }), 400

    if email in users:
        return jsonify({
            "status": "error",
            "message": "Account already exists"
        }), 409

    users[email] = {
        "password": generate_password_hash(password)
    }

    return jsonify({
        "status": "success",
        "message": "Account created"
    }), 201


@app.route("/api/auth/login", methods=["POST"])
def login():

    data = request.get_json(silent=True) or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = users.get(email)

    if not user or not check_password_hash(
        user["password"], password
    ):
        return jsonify({
            "status": "error",
            "message": "Invalid email or password"
        }), 401

    token = secrets.token_urlsafe(32)
    tokens[token] = email

    return jsonify({
        "status": "success",
        "message": "Login successful",
        "token": token
    })


# --------------------------------
# 8. ADD MEDICINE TO INVENTORY
# --------------------------------

@app.route("/api/inventory/<int:pharmacy_id>", methods=["POST"])
def add_inventory(pharmacy_id):

    data = request.get_json(silent=True) or {}

    pharmacy = next(
        (p for p in pharmacies if p["id"] == pharmacy_id),
        None
    )

    if not pharmacy:
        return jsonify({
            "status": "error",
            "message": "Pharmacy not found"
        }), 404

    required = [
        "name", "composition", "category",
        "price", "quantity", "expiry"
    ]

    for field in required:
        if field not in data or data[field] in ("", None):
            return jsonify({
                "status": "error",
                "message": f"{field} is required"
            }), 400

    if data["category"] not in categories:
        return jsonify({
            "status": "error",
            "message": "Invalid category"
        }), 400

    try:
        price = float(data["price"])
        quantity = int(data["quantity"])
    except (ValueError, TypeError):
        return jsonify({
            "status": "error",
            "message": "Invalid price or quantity"
        }), 400

    if price < 0 or quantity < 0:
        return jsonify({
            "status": "error",
            "message": "Price and quantity cannot be negative"
        }), 400

    new_medicine = {
        "name": data["name"].strip(),
        "composition": data["composition"].strip(),
        "category": data["category"],
        "price": price,
        "quantity": quantity,
        "expiry": data["expiry"]
    }

    pharmacy["medicines"].append(new_medicine)

    return jsonify({
        "status": "success",
        "message": "Medicine added to inventory",
        "medicine": new_medicine
    }), 201


# --------------------------------
# 9. GET PHARMACY INVENTORY
# --------------------------------

@app.route("/api/inventory/<int:pharmacy_id>", methods=["GET"])
def get_inventory(pharmacy_id):

    pharmacy = next(
        (p for p in pharmacies if p["id"] == pharmacy_id),
        None
    )

    if not pharmacy:
        return jsonify({
            "status": "error",
            "message": "Pharmacy not found"
        }), 404

    return jsonify({
        "status": "success",
        "inventory": pharmacy["medicines"]
    })


# --------------------------------
# START SERVER
# --------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
  