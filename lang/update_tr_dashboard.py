import json

new_translations = {
    "New": "Yeni",
    "Qualified": "Kalifiye",
    "Contacted": "İletişime Geçildi",
    "Won": "Kazanıldı",
    "Lost": "Kaybedildi",
    "(no messages yet)": "(henüz mesaj yok)",
    "Sort by": "Sırala",
    "Lead Status": "Müşteri Adayı Durumu",
    "All": "Tümü",
    "all": "tümü",
    "indexed": "dizine eklendi",
    "pending": "devam ediyor",
    "crawling": "taranıyor",
    "failed": "başarısız"
}

with open('lang/tr.json', 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(new_translations)

with open('lang/tr.json', 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, indent=4, ensure_ascii=False)

print("Updated tr.json with dashboard and widget labels.")
