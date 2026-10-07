import json

def add_translations(filename, new_data):
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    data.update(new_data)
    
    # Sort keys for consistency
    sorted_data = dict(sorted(data.items()))
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, ensure_ascii=False, indent=4)

new_tr = {
    "Page Not Found | OrbyChat": "Sayfa Bulunamadı | OrbyChat",
    "Error 404": "Hata 404",
    "Oops! You've drifted away.": "Eyvah! Biraz uzaklaşmışsın.",
    "The page you are looking for might have been moved, deleted, or never existed in this timeline.": "Aradığınız sayfa taşınmış, silinmiş veya bu zaman çizelgesinde hiç var olmamış olabilir.",
    "Back to Home": "Ana Sayfaya Dön",
    "Go Back": "Geri Git"
}

add_translations('lang/tr.json', new_tr)
print("Translations added successfully.")
