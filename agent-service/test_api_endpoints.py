import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_suggestions():
    response = client.get("/medicine/suggestions")
    print("GET /medicine/suggestions:", response.status_code)
    assert response.status_code == 200
    data = response.json()
    print("Suggestions count:", len(data.get("suggestions", [])))
    print("Sample suggestion:", data.get("suggestions", [])[0])

def test_medicine_search():
    print("\nTesting POST /medicine/search for 'Pantocid 40'...")
    response = client.post("/medicine/search", json={"query": "Pantocid 40", "country": "India"})
    print("Status code:", response.status_code)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data.get("success") is True
    data = res_data.get("data", {})
    print("Medicine Name:", data.get("medicine_name"))
    print("Generic Name:", data.get("generic_name"))
    print("Category:", data.get("category"))
    print("Buy Links Found:", len(data.get("buy_links", [])))
    for b in data.get("buy_links", []):
        print(f"  - [{b.get('source')}] {b.get('title')} -> {b.get('url')}")
    print("Substitutes Found:", len(data.get("substitutes", [])))
    for s in data.get("substitutes", []):
        print(f"  - {s.get('name')} ({s.get('composition')})")
    print("\nALL API ENDPOINT TESTS PASSED!")

if __name__ == "__main__":
    test_suggestions()
    test_medicine_search()
