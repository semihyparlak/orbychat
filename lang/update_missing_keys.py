import json

path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Missing keys from screenshots and recent audits
missing = {
    "Plans, usage, and subscription for this workspace.": "Bu çalışma alanı için planlar, kullanım ve abonelik.",
    "Search platform": "Platformda ara",
    "Search workspace": "Çalışma alanında ara",
    "Search workspaces, users, agents, leads…": "Çalışma alanları, kullanıcılar, asistanlar, müşteri adayları ara…",
    "Search agents, conversations, leads…": "Asistanlar, konuşmalar, müşteri adayları ara…",
    "Search workspaces, users, agents, and leads (Ctrl+K)": "Çalışma alanları, kullanıcılar, asistanlar ve müşteri adayları ara (Ctrl+K)",
    "Search across agents, conversations, and leads (Ctrl+K)": "Asistanlar, konuşmalar ve müşteri adayları arasında ara (Ctrl+K)",
    "Type at least 2 characters to search.": "Aramak için en az 2 karakter girin.",
    "searching…": "aranıyor…",
    "Searching…": "Aranıyor…",
    "No matches for \":q\".": "\":q\" için sonuç bulunamadı.",
    "thread": "konu",
    "workspace": "çalışma alanı",
    "Workspaces": "Çalışma Alanları",
    "Users": "Kullanıcılar",
    "Agents": "Asistanlar",
    "Leads": "Müşteri Adayları",
    "Conversations": "Konuşmalar",
    "live": "yayında",
    "draft": "taslak",
    "via :name": ":name üzerinden",
    "Choose :plan": ":plan Planını Seç",
    "Standart": "Standart",
    "Pro": "Pro",
    "Free": "Ücretsiz",
    "Current": "Mevcut",
    "Popular": "Popüler",
    "Manage subscription": "Aboneliği yönet",
    "Current plan": "Mevcut plan",
    "This month": "Bu ay",
    "Unlimited": "Sınırsız",
    "Contact sales": "Satışla iletişime geçin",
    "Custom plan": "Özel plan",
    "No payment gateway is configured for this install yet": "Bu kurulum için henüz bir ödeme yöntemi yapılandırılmadı",
    "Coming soon": "Yakında",
    "For getting live fast": "Hızlıca canlıya geçmek için",
    "Level up productivity": "Üretkenliği artırın",
    "For teams ready to scale": "Ölçeklenmeye hazır ekipler için",
    "Tailored solutions for enterprises": "İşletmeler için özel çözümler",
    "Credit / debit card (Stripe)": "Kredi / banka kartı (Stripe)",
    "PayPal": "PayPal",
    "Razorpay (UPI, cards, netbanking)": "Razorpay (UPI, kartlar, net-banking)",
    "Search by name or email…": "İsim veya e-posta ile ara…",
    "Any email state": "Herhangi bir e-posta durumu",
    "Has email": "E-postası var",
    "Missing email": "E-postası yok",
    "Newest first": "En yeni önce",
    "Oldest first": "En eski önce",
    "Lead name A-Z": "Müşteri adayı ismi A-Z",
    "Lead name Z-A": "Müşteri adayı ismi Z-A",
    "No matching leads": "Eşleşen müşteri adayı bulunamadı",
    "No leads yet": "Henüz müşteri adayı yok",
    "Dashboard": "Panel",
    "Finish setting up your first AI agent.": "İlk yapay zeka asistanınızın kurulumunu tamamlayın.",
    "Continue": "Devam et",
    "Inbox": "Gelen Kutusu",
    "New agent": "Yeni asistan",
    "Conversations 7d": "7 Günlük Konuşmalar",
    "Messages 7d": "7 Günlük Mesajlar",
    "Leads 7d": "7 Günlük Müşteri Adayları",
    "Sources 7d": "7 Günlük Kaynaklar",
    "Active agents 7d": "7 Günlük Aktif Asistanlar",
    "Up": "Artış",
    "Down": "Azalış",
    "vs previous 7d": "önceki 7 güne göre",
    "No activity": "Eylem yok",
    "Unknown lead": "Bilinmeyen müşteri adayı",
    "No agent": "Asistan yok",
    "Select :name": ":name seç",
    "Visitor leads captured by the widget will appear in this database view.": "Araç tarafından yakalanan ziyaretçi müşteri adayları bu veritabanı görünümünde görünecektir.",
    "No workspace selected.": "Çalışma alanı seçilmedi.",
    "Status": "Durum",
    "Email": "E-posta",
    "Created": "Oluşturulma",
    "Primary agent": "Birincil asistan",
    "Activity": "Aktivite",
    "All leads": "Tüm müşteri adayları",
    "New": "Yeni",
    "Qualified": "Kalifiye",
    "Contacted": "İletişime Geçildi",
    "Won": "Kazanıldı",
    "Lost": "Kaybedildi"
}

data.update(missing)

# Terminology cleanup again just in case
for k, v in data.items():
    if isinstance(v, str):
        v = v.replace('aday', 'müşteri adayı')
        v = v.replace('Aday', 'Müşteri Adayı')
        v = v.replace('ADAY', 'MÜŞTERİ ADAYI')
        data[k] = v

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Added missing keys to tr.json")
