
import csv

# Sample demo distances in kilometres
pharmacy_distances = {
    "Pharmacy A": 0.8,
    "Pharmacy B": 1.5,
    "Pharmacy C": 2.2,
    "Pharmacy D": 1.0,
    "Pharmacy E": 3.0,
    "Pharmacy F": 1.8,
    "Pharmacy G": 2.5
}


def rank_pharmacies(filename, medicine_name):

    pharmacies = {}

    with open(filename, "r", newline="") as file:

        reader = csv.DictReader(file)

        for row in reader:

            if row["medicine"].lower() == medicine_name.lower():

                pharmacy = row["pharmacy"]

                pharmacies[pharmacy] = {
                    "stock": int(row["closing_stock"]),
                    "date": row["date"]
                }

    if not pharmacies:
        print("No pharmacy records found.")
        return

    results = []

    for pharmacy, details in pharmacies.items():

        if pharmacy not in pharmacy_distances:
            continue

        stock = details["stock"]
        distance = pharmacy_distances[pharmacy]

        # Demo ranking score
        distance_score = max(0, 100 - distance * 20)
        stock_score = min(stock, 100)

        total_score = (
            distance_score * 0.60 +
            stock_score * 0.40
        )

        results.append({
            "name": pharmacy,
            "distance": distance,
            "stock": stock,
            "date": details["date"],
            "score": total_score
        })

    results.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    print("\n===== MEDINEAR PHARMACY RANKING =====")
    print("Medicine:", medicine_name)

    for rank, pharmacy in enumerate(results, start=1):

        print("\nRank:", rank)
        print("Pharmacy:", pharmacy["name"])
        print("Distance:", pharmacy["distance"], "km")
        print("Recorded stock:", pharmacy["stock"])
        print("Last recorded date:", pharmacy["date"])
        print("Ranking score:", round(pharmacy["score"], 2))

        if pharmacy["stock"] <= 10:
            print("Warning: Recorded stock is LOW.")
        else:
            print("Recorded stock is above the low-stock threshold.")


if __name__ == "__main__":

    medicine = input("Enter medicine name: ")

    rank_pharmacies("stock_data.csv", medicine)
