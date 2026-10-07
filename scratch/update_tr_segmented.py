import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Fixing segmented translations and missing sidebar items
segmented_fixes = {
    "Default shape": "Varsayılan yapı",
    "Name + Email": "İsim + E-posta",
    "Classic — Name + Email": "Klasik — İsim + E-posta",
    "B2B SaaS — Name, Work email, Company, Team size": "B2B SaaS — İsim, İş e-postası, Şirket, Ekip boyutu",
    "Support — Email + Order ID + Issue category": "Destek — E-posta + Sipariş ID + Sorun kategorisi",
    "GDPR-friendly — Email + Consent checkbox": "GDPR dostu — E-posta + Onay kutusu",
    "Your name": "İsminiz",
    "Work email": "İş e-postası",
    "Company": "Şirket",
    "Team size": "Ekip boyutu",
    "Order ID": "Sipariş ID",
    "Issue category": "Sorun kategorisi",
    "Order status": "Sipariş durumu",
    "Refund / return": "İade / değişim",
    "Product question": "Ürün sorusu",
    "Other": "Diğer",
    "I agree to be contacted about my enquiry": "Sorgumla ilgili olarak benimle iletişime geçilmesini kabul ediyorum",
    "Optional": "İsteğe bağlı",
    "required": "zorunlu",
    "reserved": "rezerve",
    "PII": "Kişisel Veri",
    "Add field": "Alan ekle",
    "Replace with preset…": "Şablonla değiştir...",
    "Reset to default": "Varsayılana sıfırla",
    "New field": "Yeni alan",
    "Dropdown": "Açılır Menü",
    "Checkbox": "Onay Kutusu",
    "Long text": "Uzun metin",
    "Text": "Metin",
    "Email": "E-posta",
    "Phone": "Telefon",
    "Key": "Anahtar",
    "Label": "Etiket",
    "Type": "Tür",
    "Placeholder": "Yer tutucu",
    "Max length": "Maksimum uzunluk",
    "Options (one per line)": "Seçenekler (her satıra bir tane)",
    "Lowercase, digits, underscores. Reserved keys email, name, phone map onto Lead columns.": "Küçük harf, rakam, alt çizgi. Rezerve edilmiş anahtarlar (email, name, phone) Müşteri Adayı sütunlarıyla eşleşir.",
    "Required": "Zorunlu",
    "No fields yet — visitors will see an empty form. Add at least an Email field.": "Henüz alan yok — ziyaretçiler boş bir form görecek. En azından bir E-posta alanı ekleyin.",
    ":count/:max fields used. Required fields are enforced both by the widget and on the server.": ":count/:max alan kullanıldı. Zorunlu alanlar hem widget hem de sunucu tarafından denetlenir.",
    "Reserved key — maps onto Lead.email / .name / .phone columns": "Rezerve anahtar — Lead.email / .name / .phone sütunlarıyla eşleşir.",
    "High-sensitivity field name. Are you sure you want to store this?": "Yüksek hassasiyetli alan adı. Bunu saklamak istediğinizden emin misiniz?",
    "Start from a preset…": "Bir şablondan başlayın..."
}

for k, v in segmented_fixes.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json segmented translations updated")
