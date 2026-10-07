import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Fixing the Settings and Agent Settings pages
settings_fixes = {
    "Settings": "Ayarlar",
    "Manage your profile and account settings": "Profil ve hesap ayarlarınızı yönetin",
    "ACCOUNT": "HESAP",
    "Profile": "Profil",
    "Security": "Güvenlik",
    "Appearance": "Görünüm",
    "Widget": "Widget",
    "Delete account": "Hesabı sil",
    "Delete your account and all of its resources": "Hesabınızı ve tüm kaynaklarını silin",
    "Warning": "Uyarı",
    "Allowed origins": "İzin verilen alan adları",
    "Auto-skips /admin, /checkout, /cart, /account, and /login. Capped at 30 pages/hour per agent.": "/admin, /checkout, /cart, /account ve /login sayfalarını otomatik olarak atlar. Asistan başına saatte 30 sayfa ile sınırlıdır.",
    "Agent settings": "Asistan ayarları",
    "Tune how this agent answers, where the widget is allowed to run, and what installation code customers should paste onto their site.": "Bu asistanın nasıl yanıt vereceğini, widget'ın nerede çalışmasına izin verileceğini ve müşterilerin sitelerine hangi kurulum kodunu yapıştırması gerektiğini ayarlayın.",
    "vs previous 30d": "önceki 30 güne göre",
    "Default shape: Name + Email.": "Varsayılan yapı: İsim + E-posta.",
    "Visitors see a name field (optional) and an email field (required). Customize to ask for company, order ID, consent, or whatever your sales / support flow needs.": "Ziyaretçiler bir isim alanı (isteğe bağlı) ve bir e-posta alanı (zorunlu) görür. Şirket, sipariş numarası, onay veya satış / destek akışınızın gerektirdiği her şeyi istemek için özelleştirin.",
    "Start from a preset...": "Bir şablondan başlayın...",
    "Özelleştir": "Özelleştir",
    "Save changes": "Değişiklikleri kaydet",
    "Update your name and email address": "İsminizi ve e-posta adresinizi güncelleyin",
    "Profile information": "Profil bilgileri",
    "Name": "İsim",
    "Email address": "E-posta adresi",
    "Update password": "Şifreyi güncelle",
    "Ensure your account is using a long, random password to stay secure.": "Güvende kalmak için hesabınızın uzun ve rastgele bir şifre kullandığından emin olun.",
    "Current password": "Mevcut şifre",
    "New password": "Yeni şifre",
    "Confirm password": "Şifreyi onayla",
    "Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.": "Hesabınız silindiğinde, tüm kaynakları ve verileri kalıcı olarak silinecektir. Hesabınızı silmeden önce lütfen saklamak istediğiniz tüm verileri veya bilgileri indirin.",
    "Are you sure you want to delete your account?": "Hesabınızı silmek istediğinizden emin misiniz?",
    "Cancel": "İptal",
    "Delete Account": "Hesabı Sil"
}

for k, v in settings_fixes.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json settings translations updated")
