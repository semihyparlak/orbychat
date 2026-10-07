import re
import json

with open('app/Support/MarketingHomeContent.php', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all __() calls
matches = re.findall(r"__\('(.+?)'\)", content)
unique_keys = sorted(list(set(matches)))

# Simple mapping for some common ones to help me start
translations = {}
for key in unique_keys:
    translations[key] = key # Fallback

# I will update these manually in the next step
with open('lang/extracted_marketing.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, indent=4, ensure_ascii=False)

print(f"Extracted {len(unique_keys)} keys.")
