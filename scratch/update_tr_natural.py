import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# More natural Turkish phrasing (dropping the "for/için" where appropriate)
natural_translations = {
    "AI Sales Assistant for {page_title} — {brand}": "{page_title} Yapay Zeka Satış Asistanı — {brand}",
    "AI Sales Assistant for :industry": ":industry Yapay Zeka Satış Asistanı",
    "E-commerce store": "E-Ticaret", # Making it concise as requested before
    "Industry Solutions": "Sektörel Çözümler",
    "Industry Verticals": "Sektörel Çözümler",
    "Tailored AI for Every Industry": "Her Sektöre Özel Yapay Zeka"
}

for k, v in natural_translations.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json updated with natural Turkish phrasing")
