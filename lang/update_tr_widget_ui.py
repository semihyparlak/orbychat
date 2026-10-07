import json
import os

tr_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

new_translations = {
    "AI assistant": "Yapay Zeka Asistanı",
    "Live support": "Canlı Destek",
    "Close": "Kapat",
    "Clear conversation": "Sohbeti Temizle",
    "Send": "Gönder",
    "Sending...": "Gönderiliyor...",
    "Dismiss": "Kapat",
    "Powered by": "Destekleyen",
    "Ask anything": "Bir şey sorun",
    "Leave your details — we'll get back to you.": "Bilgilerinizi bırakın, size geri döneceğiz.",
    "Please enter a valid email address.": "Lütfen geçerli bir e-posta adresi girin.",
    "Could not save your details. Please try again.": "Bilgileriniz kaydedilemedi. Lütfen tekrar deneyin.",
    "Your name": "Adınız",
    "Email": "E-posta",
    "email@example.com": "eposta@ornek.com",
    "Phone number": "Telefon numarası",
    "Optional": "İsteğe bağlı",
    "Date": "Tarih",
    "Time": "Saat",
    "AI is typing...": "Yapay zeka yazıyor...",
    "Thinking...": "Düşünüyor...",
    "Start voice input": "Ses girişini başlat",
    "Stop voice input": "Ses girişini durdur",
    "Voice input not supported in this browser": "Bu tarayıcıda ses girişi desteklenmiyor",
    "Retry": "Tekrar dene",
    "Copy": "Kopyala",
    "Sources": "Kaynaklar",
    "Live agent": "Canlı operatör",
    "Connect me with a human": "Beni bir insana bağla",
    "Read more": "Daha fazla oku",
    "View": "Görüntüle",
    "Code copied to clipboard!": "Kod panoya kopyalandı!",
    "Schedule appointment": "Randevu al",
    "Schedule Appointment": "Randevu Planla",
    "Please select a suitable time from the form below.": "Lütfen aşağıdaki formdan uygun bir zaman seçin.",
    "We received your request and will get back to you shortly.": "Talebiniz alındı, en kısa sürede size geri döneceğiz.",
    "Appointment Requested": "Randevu Talep Edildi",
    "Thanks — we'll get back to you soon.": "Teşekkürler, yakında size geri döneceğiz.",
    "Share your details so we can pick up where the chat leaves off.": "Sohbetin kaldığı yerden devam edebilmesi için bilgilerinizi paylaşın.",
    "Start chat": "Sohbete başla",
    "Back": "Geri",
    "Jan": "Oca", "Feb": "Şub", "Mar": "Mar", "Apr": "Nis", "May": "May", "Jun": "Haz",
    "Jul": "Tem", "Aug": "Ağu", "Sep": "Eyl", "Oct": "Eki", "Nov": "Kas", "Dec": "Ara",
    "Sun_S": "Paz", "Mon_M": "Pzt", "Tue_T": "Sal", "Wed_W": "Çar", "Thu_T": "Per", "Fri_F": "Cum", "Sat_S": "Cmt",
    "Select time": "Saat seçin",
    "Starting chat...": "Sohbet başlatılıyor...",
    "Please fill in \":field\".": "Lütfen \":field\" alanını doldurun.",
    "I consent to processing of my data.": "Verilerimin işlenmesine izin veriyorum.",
    "Please accept the data processing terms.": "Lütfen veri işleme şartlarını kabul edin.",
    "Case study": "Örnek çalışma",
    "Order": "Sipariş",
    "Track Package": "Paketi Takip Et",
    "Account Status": "Hesap Durumu",
    "Plan": "Plan",
    "Usage": "Kullanım",
    "API Endpoint": "API Uç Noktası",
    "Versions": "Versiyonlar",
    "Troubleshooting": "Sorun Giderme",
    "Select an option": "Bir seçenek belirleyin",
    "Insurance": "Sigorta",
    "Treatment": "Tedavi",
    "Treatment Info": "Tedavi Bilgisi",
    "Estimated": "Tahmini",
    "Ready to get started?": "Başlamaya hazır mısınız?",
    "Create Free Account": "Ücretsiz Hesap Oluştur",
    "Plan Details": "Plan Detayları"
}

with open(tr_path, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(new_translations)

with open(tr_path, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, indent=4, ensure_ascii=False)

print(f"Updated {tr_path} with widget UI labels.")
