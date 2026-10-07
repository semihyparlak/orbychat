import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Final polish for Analytics and Dashboard
final_polish = {
    ":direction :percentage% vs previous 30d": ":direction %:percentage önceki 30 güne göre",
    "vs previous 30d": "önceki 30 güne göre",
    "up": "artış",
    "down": "azalış",
    "Stable": "Stabil",
    "Bilgi sağlığı": "Bilgi sağlığı",
    "dizine eklendi": "dizine eklendi",
    "devam ediyor": "devam ediyor",
    "başarısız": "başarısız",
    "Müşteri Adayı akışı": "Müşteri Adayı akışı",
    "Yakalanan müşteri adaylarının mevcut durumlarınıza göre dağılımı.": "Yakalanan müşteri adaylarının mevcut durumlarınıza göre dağılımı.",
    "Toplam": "Toplam",
    "Built-in Capabilities": "Yerleşik Yetenekler",
    "capabilities": "yetenekler",
    "appointment_requests": "Randevu talepleri",
    "lead_capture": "Müşteri yakalama"
}

for k, v in final_polish.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json final polish updated")
