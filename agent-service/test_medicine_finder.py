import sys
import io

# Set stdout to UTF-8 for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from medicine_finder import run_medicine_finder_agent

if __name__ == "__main__":
    print("Testing Medicine Finder Agent for 'Dolo 650'...")
    result = run_medicine_finder_agent("Dolo 650")
    print("\n--- Medicine Info ---")
    print(f"Name: {result.medicine_name}")
    print(f"Generic / Salt: {result.generic_name}")
    print(f"Manufacturer: {result.manufacturer}")
    print(f"Category: {result.category}")
    print(f"Prescription Required: {result.prescription_required}")
    print(f"Description: {result.description}")
    print(f"Uses: {result.uses}")
    print(f"Dosage Forms: {result.dosage_forms}")
    print(f"Warnings: {result.warnings}")
    print(f"Side Effects: {result.side_effects}")
    print(f"\nSubstitutes ({len(result.substitutes)}):")
    for s in result.substitutes:
        print(f" - {s.name} ({s.composition}) by {s.manufacturer}: {s.price_comparison}")
    print(f"\nBuy Links ({len(result.buy_links)}):")
    for b in result.buy_links:
        print(f" - [{b.source}] {b.title} ({b.badge}) -> {b.url}")
    print(f"\nInfo Links ({len(result.info_links)}):")
    for i in result.info_links:
        print(f" - [{i.source}] {i.title} ({i.badge}) -> {i.url}")
    print("\nSUCCESS!")
