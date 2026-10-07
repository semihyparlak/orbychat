import json
import re
import os

path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match "key": "value" lines
# Handling escaped quotes inside keys and values
pattern = re.compile(r'^\s*\"(.*?)(?<!\\)\"\s*:\s*\"(.*?)(?<!\\)\"\s*,?\s*$', re.MULTILINE)

data = {}
matches = pattern.findall(content)
for key, value in matches:
    # Basic unescaping for common JSON chars if they were double escaped in the source
    # though findall should give us the literal content between quotes
    data[key] = value

print(f"Found {len(data)} unique keys.")

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
