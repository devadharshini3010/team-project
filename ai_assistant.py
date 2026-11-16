
from rapidfuzz import process, fuzz

# Medicine database
medicine_list = [
    "Paracetamol",
    "Cetirizine",
    "Amoxicillin",
    "Azithromycin",
    "Ibuprofen",
    "Dolo 650"
]


def medicine_assistant(user_input):

    user_input = user_input.strip()

    # Check empty input
    if not user_input:
        return {
            "message": "Please enter a medicine name.",
            "suggestions": []
        }

    # Find the three closest spelling matches
    matches = process.extract(
        user_input,
        medicine_list,
        scorer=fuzz.ratio,
        limit=3
    )

    # Filter possible spelling matches
    suggestions = [
        {
            "name": name,
            "score": round(score, 2)
        }
        for name, score, index in matches
        if score >= 65
    ]

    if not suggestions:
        return {
            "message": "No reliable spelling match found.",
            "suggestions": []
        }

    return {
        "message": "Please confirm the correct medicine name.",
        "suggestions": suggestions
    }


# Run the program
if __name__ == "__main__":

    while True:

        user_input = input("\nEnter medicine name (or type exit): ")

        if user_input.lower() == "exit":
            print("MediNear AI closed.")
            break

        response = medicine_assistant(user_input)

        print("\nMediNear AI:", response)
