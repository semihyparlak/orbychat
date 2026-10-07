import json
import os

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print("JSON is valid")
    print(f"Total keys: {len(data)}")
    
    # Check for specific keys
    keys_to_check = [
        "E-commerce store",
        "product_card",
        "AI Sales Assistant for :industry",
        "Start growing your :industry business today."
    ]
    
    for key in keys_to_check:
        if key in data:
            print(f"Key found: '{key}' -> '{data[key]}'")
        else:
            print(f"Key NOT found: '{key}'")

except Exception as e:
    print(f"Error: {e}")
