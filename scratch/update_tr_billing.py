import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Fixing the 'conversations' issue in pricing plans
billing_fixes = {
    ":count conversations": ":count görüşme",
    "conversations": "görüşme",
    "Unlimited conversations": "Sınırsız görüşme",
    "Current plan": "Mevcut plan",
    "This month": "Bu ay",
    "Manage subscription": "Aboneliği yönet",
    "Popular": "Popüler",
    "Current": "Mevcut",
    "Choose :plan": ":plan Planını Seç",
    "Contact sales": "Satışla iletişime geçin",
    "Coming soon": "Yakında",
    "Pick a payment method": "Bir ödeme yöntemi seçin",
    "Continue": "Devam et",
    "Cancel": "İptal",
    "Free": "Ücretsiz",
    "Standard": "Standart",
    "Pro": "Pro",
    "Custom": "Özel"
}

for k, v in billing_fixes.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json billing translations updated")
