import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Translating the capability slugs
capability_fixes = {
    "appointment_requests": "Randevu Talepleri",
    "lead_capture": "Müşteri Yakalama",
    "product_inventory": "Ürün Envanteri",
    "order_status": "Sipariş Durumu",
    "shipping_estimate": "Kargo Tahmini",
    "product_recommendations": "Ürün Önerileri",
    "product_comparison": "Ürün Karşılaştırma",
    "ecommerce_discounts": "E-Ticaret İndirimleri",
    "ecommerce_tracking": "E-Ticaret Takibi",
    "ecommerce_inventory": "E-Ticaret Envanteri"
}

for k, v in capability_fixes.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json capability slugs updated")
