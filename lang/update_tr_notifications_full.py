import json
import os

tr_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

new_translations = {
    "Browser alerts are blocked. Enable them from your browser settings to get pinged on new leads.": "Tarayıcı bildirimleri engellendi. Yeni müşteri adaylarından haberdar olmak için tarayıcı ayarlarınızdan bildirimleri etkinleştirin.",
    "Browser alerts already enabled": "Tarayıcı bildirimleri zaten etkin",
    "Browser alerts on — new leads will ping you.": "Tarayıcı bildirimleri açık — yeni müşteri adayları size bildirilecek.",
    "Lead alerts are on": "Müşteri adayı bildirimleri açık",
    "Lead alerts blocked — enable in browser settings": "Müşteri adayı bildirimleri engellendi — tarayıcı ayarlarından etkinleştirin",
    "Enable browser alerts for new leads": "Yeni müşteri adayları için tarayıcı bildirimlerini etkinleştirin"
}

with open(tr_path, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(new_translations)

with open(tr_path, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, indent=4, ensure_ascii=False)

print(f"Updated {tr_path} with comprehensive notification labels.")
