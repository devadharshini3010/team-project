
import csv
from collections import defaultdict


def predict_stock(filename, medicine_name):

    daily_sales = defaultdict(list)
    current_stock = {}

    with open(filename, "r", newline="") as file:
        reader = csv.DictReader(file)

        for row in reader:
            if row["medicine"].lower() == medicine_name.lower():

                pharmacy = row["pharmacy"]

                daily_sales[pharmacy].append(
                    int(row["units_sold"])
                )

                current_stock[pharmacy] = int(
                    row["closing_stock"]
                )

    if not daily_sales:
        print("No sample stock records found.")
        return

    for pharmacy, sales in daily_sales.items():

        average_sales = sum(sales) / len(sales)
        stock = current_stock[pharmacy]

        if average_sales > 0:
            days_left = stock / average_sales
        else:
            days_left = 0

        print("\nPharmacy:", pharmacy)
        print("Medicine:", medicine_name)
        print("Current recorded stock:", stock)
        print("Average daily sales:", round(average_sales, 2))
        print("Estimated stock duration:", round(days_left, 1), "days")

        if days_left <= 3:
            print("Prediction: Stock may become LOW soon.")
        else:
            print("Prediction: Stock may be sufficient for now.")


if __name__ == "__main__":

    medicine = input("Enter medicine name: ")

    predict_stock("stock_data.csv", medicine)
