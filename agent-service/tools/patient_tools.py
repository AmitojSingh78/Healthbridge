import os
import requests
from dotenv import load_dotenv

load_dotenv()
NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api/automation")


def search_patient(patient_name: str) -> dict:
    """
    Lookup patient details by patient name from the hospital database.
    """
    response = requests.get(
        f"{NODE_API_URL}/patient/search",
        params={"name": patient_name},
        timeout=10
    )
    if response.status_code != 200:
        raise ValueError(
            f"Patient not found or query error: {patient_name} (Status {response.status_code})"
        )

    data = response.json()
    if not data.get("success"):
        raise ValueError(data.get("message", "Failed to retrieve patient"))
    return data.get("patient")


def get_patient_lab_orders(patient_id: str) -> list:
    """
    Fetch existing lab orders for a patient by their patient ID.
    """
    response = requests.get(
        f"{NODE_API_URL}/labs/patient/{patient_id}",
        timeout=10
    )
    if response.status_code != 200:
        raise ValueError(
            f"Failed to fetch lab orders for patient {patient_id} (Status {response.status_code})"
        )

    data = response.json()
    return data.get("labOrders", [])


def get_patient_insurance(patient_id: str) -> dict:
    """
    Fetch patient insurance status and pre-authorization details by patient ID.
    """
    response = requests.get(
        f"{NODE_API_URL}/insurance/{patient_id}",
        timeout=10
    )
    if response.status_code != 200:
        raise ValueError(
            f"Failed to fetch insurance details for patient {patient_id} (Status {response.status_code})"
        )

    data = response.json()
    return data.get("insurance")
