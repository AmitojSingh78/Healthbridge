import os
import requests
from dotenv import load_dotenv

load_dotenv()
NODE_API_URL = os.getenv("NODE_API_URL", "http://localhost:5000/api/automation")


def get_procedure_protocol(procedure_code: str) -> dict:
    """
    Fetch protocol guidelines for a medical procedure (required bed type, tests, OT duration).
    """
    response = requests.get(
        f"{NODE_API_URL}/procedure/{procedure_code}",
        timeout=10
    )
    if response.status_code != 200:
        raise ValueError(
            f"Procedure protocol not found: {procedure_code} (Status {response.status_code})"
        )

    data = response.json()
    if not data.get("success"):
        raise ValueError(data.get("message", "Failed to retrieve procedure protocol"))

    return data.get("procedure")


def get_available_beds(ward: str) -> list:
    """
    Fetch all currently available beds in a specific hospital ward.
    """
    response = requests.get(
        f"{NODE_API_URL}/beds/available",
        params={"ward": ward},
        timeout=10
    )
    if response.status_code != 200:
        raise ValueError(
            f"Failed to fetch beds for ward: {ward} (Status {response.status_code})"
        )

    data = response.json()
    return data.get("beds", [])


def get_available_ots(procedure_code: str, requested_date: str) -> list:
    """
    Fetch all Operation Theatres and their available time slots for a given procedure and date.
    """
    response = requests.get(
        f"{NODE_API_URL}/ots/available",
        params={
            "procedure": procedure_code,
            "date": requested_date
        },
        timeout=10
    )
    if response.status_code != 200:
        raise ValueError(
            f"Failed to fetch OT availability for {procedure_code} on {requested_date} (Status {response.status_code})"
        )

    data = response.json()
    return data.get("operationTheatres", [])
