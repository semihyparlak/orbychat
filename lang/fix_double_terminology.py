import json

path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_data = {}
for k, v in data.items():
    if isinstance(v, str):
        # Fix the double replacement
        v = v.replace('müşteri müşteri adayı', 'müşteri adayı')
        v = v.replace('Müşteri Müşteri Adayı', 'Müşteri Adayı')
        v = v.replace('MÜŞTERİ MÜŞTERİ ADAYI', 'MÜŞTERİ ADAYI')
    new_data[k] = v

# Ensure Choose :plan is exactly as in code
# Checking for any hidden characters or variations
new_data["Choose :plan"] = ":plan Planını Seç"

with open(path, 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)

print("Fixed double terminology replacement in tr.json")
