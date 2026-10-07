import json
import os

tr_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

new_translations = {
    "Reindex queued": "Yeniden indeksleme sıraya alındı",
    "thinking…": "düşünüyor…",
    "Back to agent": "Asistana geri dön",
    "Single URL — crawl just this one page": "Tek URL — sadece bu sayfayı tara",
    "Sitemap — crawl all URLs in the sitemap.xml": "Site Haritası — sitemap.xml'deki tüm URL'leri tara",
    "Publish this agent before the snippet can run for visitors.": "Kod parçacığının ziyaretçiler için çalışabilmesi için önce bu asistanı yayınlayın.",
    "Restrict this public widget script to trusted domains. Each origin must include the scheme and host.": "Bu genel widget scriptini güvenilir alan adlarıyla sınırlayın. Her köken (origin) protokol ve ana makine adını içermelidir.",
    "Strict match. Subdomains are not inferred. https://example.com does not permit https://app.example.com.": "Tam eşleşme. Alt alan adları otomatik olarak dahil edilmez. Örneğin https://example.com adresi https://app.example.com için izin vermez.",
    "URL paths the widget should NOT mount on. Mirrors Allowed origins but for paths within an already-allowed origin — use it to keep the bot off your own /admin, /checkout, or /account flows without touching code.": "Widget'ın yüklenmemesi gereken URL yolları. İzin verilen kökenleri yansıtır ancak halihazırda izin verilmiş bir köken içindeki yollar içindir — botu kod değiştirmeden /admin, /checkout veya /account akışlarınızdan uzak tutmak için kullanın.",
    "Glob patterns. Use * as a wildcard. Example:": "Glob desenleri. Joker karakter olarak * kullanın. Örnek:",
    "/admin → exact path only": "/admin → sadece tam yol",
    "/admin/* → anything under /admin": "/admin/* → /admin altındaki her şey",
    "/checkout, /account/* — case-insensitive": "/checkout, /account/* — büyük/küçük harfe duyarsız",
    "One path per line": "Satır başına bir yol",
    "Save origins": "Kökenleri kaydet",
    "Save paths": "Yolları kaydet",
    "Publishing": "Yayınlanıyor",
    "Ready": "Hazır"
}

with open(tr_path, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(new_translations)

with open(tr_path, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, indent=4, ensure_ascii=False)

print(f"Updated {tr_path} with technical, restriction and status labels.")
