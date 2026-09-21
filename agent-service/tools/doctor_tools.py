import os
import requests
from dotenv import load_dotenv

load_dotenv()
NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api/automation")


def check_doctor_availability(doctor_name: str, requested_date: str) -> dict:
    """
    Check if a doctor is available on a specific date (YYYY-MM-DD) and return doctor details.
    """
    response = requests.get(
        f"{NODE_API_URL}/doctor/availability",
        params={
            "doctorName": doctor_name,
            "date": requested_date
        },
        timeout=10
    )
    if response.status_code != 200:
        raise ValueError(
            f"Doctor lookup or availability check failed: {doctor_name} (Status {response.status_code})"
        )

    data = response.json()
    if not data.get("success"):
        raise ValueError(data.get("message", "Failed to retrieve doctor availability"))

    return {
        "doctor": data.get("doctor"),
        "available": data.get("available", False),
        "existingAppointments": data.get("existingAppointments", [])
    }
