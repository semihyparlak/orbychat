import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Fixing the Dashboard and Lead flow status
dashboard_fixes = {
    "New": "Yeni",
    "Qualified": "Kalifiye",
    "Contacted": "İletişime Geçildi",
    "Won": "Kazanıldı",
    "Lost": "Kaybedildi",
    "System": "Sistem",
    "Widget defaults": "Widget varsayılanları",
    "Branding": "Markalama",
    "Marketing site": "Pazarlama sitesi",
    "Privacy & GDPR": "Gizlilik ve GDPR",
    "Account": "Hesap",
    "Platform": "Platform",
    "appointment_requests": "Randevu Talepleri",
    "lead_capture": "Müşteri Yakalama",
    "Total": "Toplam"
}

for k, v in dashboard_fixes.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json dashboard/lead translations updated")
