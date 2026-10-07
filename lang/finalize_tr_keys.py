import json

path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

missing = {
    "Getting Started": "Başlarken",
    "Set up :name in a few steps": ":name kurulumunu birkaç adımda yapın",
    "Upgrade to Pro": "Pro'ya Yükselt",
    "Unlock more conversations": "Daha fazla görüşmenin kilidini açın",
    "Switch workspace": "Çalışma alanını değiştir",
    "Marketing site": "Pazarlama sitesi",
    "Open marketing site": "Pazarlama sitesini aç",
    "Toggle theme": "Temayı değiştir",
    "Profile": "Profil",
    "Settings": "Ayarlar",
    "Logout": "Çıkış Yap",
    "Dashboard": "Panel",
    "Inbox": "Gelen Kutusu",
    "Calendar": "Takvim",
    "Conversations": "Konuşmalar",
    "Agents": "Asistanlar",
    "Workflows": "İş Akışları",
    "Analytics": "Analizler",
    "Integrations": "Entegrasyonlar",
    "Members": "Üyeler",
    "Billing": "Faturalandırma",
    "thread": "konu",
    "workspace": "çalışma alanı",
    "live": "yayında",
    "draft": "taslak",
    "searching…": "aranıyor…",
    "Searching…": "Aranıyor…",
    "No matches for \":q\".": "\":q\" için sonuç bulunamadı.",
    "Type at least 2 characters to search.": "Aramak için en az 2 karakter girin.",
}

data.update(missing)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Finalized tr.json missing keys")
