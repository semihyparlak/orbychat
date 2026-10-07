import json
import os

tr_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

new_translations = {
    "You already have an active subscription. Please manage it from the billing page.": "Zaten aktif bir aboneliğiniz var. Lütfen fatura sayfasından yönetin.",
    "This plan is not purchasable. Contact sales for Custom plans.": "Bu plan satın alınabilir değil. Özel planlar için satış ekibiyle iletişime geçin.",
    "Unknown payment gateway.": "Bilinmeyen ödeme yöntemi.",
    "PayPal did not return an approval URL.": "PayPal bir onay URL'si döndürmedi.",
    "Razorpay did not return a subscription id.": "Razorpay bir abonelik ID'si döndürmedi.",
    "Could not initialize Stripe price: ": "Stripe fiyatı başlatılamadı: ",
    "Could not initialize PayPal plan: ": "PayPal planı başlatılamadı: ",
    "PayPal could not create the subscription: ": "PayPal abonelik oluşturamadı: ",
    "Could not initialize Razorpay plan: ": "Razorpay planı başlatılamadı: ",
    "Razorpay could not create the subscription: ": "Razorpay abonelik oluşturamadı: "
}

with open(tr_path, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(new_translations)

with open(tr_path, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, indent=4, ensure_ascii=False)

print(f"Updated {tr_path} with checkout error labels.")
