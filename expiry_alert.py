
import csv
from datetime import datetime, date

def check_expiry(filename):

    medicine_name = input("Enter medicine name: ").strip().lower()

    today = date.today()
    found = False

    with open(filename, "r") as file:
        reader = csv.DictReader(file)

        for row in reader:

            if row["medicine"].strip().lower() == medicine_name:

                found = True

                expiry_date = datetime.strptime(
                    row["expiry_date"], "%Y-%m-%d"
                ).date()

                days_left = (expiry_date - today).days

                if days_left < 0:
                    status = "EXPIRED - Remove from sale"
                elif days_left <= 30:
                    status = "EXPIRING SOON"
                else:
                    status = "SAFE DATE RANGE"

                print("\nPharmacy:", row["pharmacy"])
                print("Medicine:", row["medicine"])
                print("Batch:", row["batch"])
                print("Quantity:", row["quantity"])
                print("Expiry Date:", expiry_date)
                print("Days Left:", days_left)
                print("Status:", status)
                print("----------------------")

    if not found:
        print("Medicine not found in expiry records.")


if __name__ == "__main__":
    check_expiry("expiry_data.csv")
