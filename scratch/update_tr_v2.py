import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# New/Corrected keys
new_keys = {
    "E-commerce store": "E-Ticaret Mağazası",
    "AI Sales Assistant for {page_title} — {brand}": "{page_title} için Yapay Zeka Satış Asistanı — {brand}",
    "AI Sales Assistant for :industry": ":industry için Yapay Zeka Satış Asistanı",
    "How it works": "Nasıl çalışır",
    "Tailored AI for Every Industry": "Her Sektör İçin Özel Yapay Zeka"
}

for k, v in new_keys.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json updated successfully")
