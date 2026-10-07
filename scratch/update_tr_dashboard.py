import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Massive dashboard translation update
dashboard_translations = {
    # Account & Settings
    "Current members (:count)": "Mevcut üyeler (:count)",
    "Manage your profile and account settings": "Profil ve hesap ayarlarınızı yönetin",
    "ACCOUNT": "HESAP",
    "Profile": "Profil",
    "Security": "Güvenlik",
    "Appearance": "Görünüm",
    "Widget": "Araç (Widget)",
    "Profile information": "Profil bilgileri",
    "Update your name and email address": "İsim ve e-posta adresinizi güncelleyin",
    "Delete account": "Hesabı sil",
    "Delete your account and all of its resources": "Hesabınızı ve tüm kaynaklarını silin",
    "Please proceed with caution, this cannot be undone.": "Lütfen dikkatli devam edin, bu işlem geri alınamaz.",
    "Warning": "Uyarı",
    
    # Table & Lists
    "Sort": "Sırala",
    "Filters": "Filtreler",
    "Column settings": "Sütun ayarları",
    
    # Agent Status & Publishing
    "The operational state for this agent and its visitor-facing widget.": "Bu asistanın ve ziyaretçi tarafındaki aracın çalışma durumu.",
    "PUBLISHING": "YAYINLAMA",
    "Widget installation is available.": "Araç kurulumu kullanılabilir.",
    "ALLOWED ORIGINS": "İZİN VERİLEN ALAN ADLARI",
    "Exact domains allowed to load this widget.": "Bu aracın yüklenmesine izin verilen tam alan adları.",
    "AUTO-INDEXING": "OTOMATİK DİZİNE EKLEME",
    "On": "Açık",
    "Off": "Kapalı",
    "Visited pages can grow the knowledge base automatically.": "Ziyaret edilen sayfalar bilgi tabanını otomatik olarak büyütebilir.",
    "When enabled, new visitor pages are queued for crawl and indexing in the background.": "Etkinleştirildiğinde, yeni ziyaretçi sayfaları arka planda taranmak ve dizine eklenmek üzere sıraya alınır.",
    "Auto-skips /admin, /checkout, /cart, /account, and /login. Capped at 30 pages/hour per agent.": "/admin, /checkout, /cart, /account ve /login sayfalarını otomatik atlar. Asistan başına saatte 30 sayfa ile sınırlıdır.",
    
    # Lead Collection
    "Lead collection settings": "Müşteri adayı toplama ayarları",
    "Configure how you capture visitor information.": "Ziyaretçi bilgilerini nasıl yakalayacağınızı yapılandırın.",
    "Pre-chat gate (Gating)": "Sohbet öncesi formu (Gating)",
    "Ask for lead information before allowing the visitor to start a chat.": "Ziyaretçinin sohbete başlamasına izin vermeden önce iletişim bilgilerini isteyin.",
    "LEAD FORM FIELDS": "MÜŞTERİ FORMU ALANLARI",
    "Default shape: Name + Email": "Varsayılan yapı: İsim + E-posta",
    "Visitors see a name field (optional) and an email field (required). Customize to ask for company, order ID, consent, or whatever your sales / support flow needs.": "Ziyaretçiler bir isim alanı (isteğe bağlı) ve bir e-posta alanı (zorunlu) görür. Şirket, sipariş numarası veya satış akışınızın gerektirdiği diğer bilgileri istemek için özelleştirin.",
    "Start from a preset...": "Bir hazır ayardan başla..."
}

for k, v in dashboard_translations.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json dashboard translations updated")
