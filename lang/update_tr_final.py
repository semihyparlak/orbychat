import json
import os

tr_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

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
    "failed": "başarısız",
    "in progress": "devam ediyor",
    "Newest first": "En yeni",
    "Oldest first": "En eski",
    "Name (A-Z)": "İsim (A-Z)",
    "Name (Z-A)": "İsim (Z-A)",
    "Lead name A-Z": "Müşteri adı A-Z",
    "Lead name Z-A": "Müşteri adı Z-A",
    "Contact info": "İletişim bilgisi",
    "All leads": "Tüm müşteri adayları",
    "With email": "E-postası olanlar",
    "Without email": "E-postası olmayanlar",
    "Any email state": "Tüm e-posta durumları",
    "Has email": "E-postası var",
    "Missing email": "E-postası eksik",
    "Workspace report": "Çalışma alanı raporu",
    "Conversations are the blue area. Leads are the dotted line, so you can see whether capture is keeping pace with traffic.": "Sohbetler mavi alandır. Müşteri adayları kesikli çizgidir, böylece yakalamanın trafikle uyumlu olup olmadığını görebilirsiniz.",
    "Knowledge health": "Bilgi sağlığı",
    "Distribution of captured leads across your current statuses.": "Yakalanan müşteri adaylarının mevcut durumlarınıza göre dağılımı."
}

with open(tr_path, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(new_translations)

with open(tr_path, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, indent=4, ensure_ascii=False)

print(f"Updated {tr_path} with {len(new_translations)} keys.")
