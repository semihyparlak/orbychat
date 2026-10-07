import json
import os

tr_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

new_translations = {
    "All set — go to dashboard": "Her şey hazır — panele git",
    "Configuring agent in": "Asistan yapılandırılıyor:",
    "Creating your first agent in": "İlk asistanınız oluşturuluyor:",
    "These 4 steps configure this agent: pick which pages it learns from, then grab a snippet to embed it on your site.": "Bu 4 adım asistanı yapılandırır: hangi sayfalardan öğreneceğini seçin, ardından sitenize eklemek için bir kod parçacığı alın.",
    "You can always add more agents, edit personality, theme, or knowledge sources from the agent dashboard later.": "Daha sonra asistan panelinden her zaman daha fazla asistan ekleyebilir, kişiliği, teması veya bilgi kaynaklarını düzenleyebilirsiniz.",
    "First-time setup": "İlk kurulum",
    "4 quick steps": "4 hızlı adım",
    "Setup": "Kurulum",
    "Set up your AI agent": "AI asistanınızı kurun",
    "Rename this agent": "Bu asistanı yeniden adlandır",
    "Rename": "Yeniden Adlandır",
    "Saving…": "Kaydediliyor…",
    "We've created an agent for you in this workspace. The 4 steps below feed it the knowledge it needs and give you a snippet to embed on your site.": "Bu çalışma alanında sizin için bir asistan oluşturduk. Aşağıdaki 4 adım ona ihtiyacı olan bilgiyi sağlayacak ve sitenize eklemeniz için bir kod parçacığı verecek.",
    "1. Connect": "1. Bağlan",
    "2. Detect": "2. Algıla",
    "3. Pick pages": "3. Sayfaları seç",
    "4. Install": "4. Kur",
    "Where does your agent live?": "Asistanınız nerede yaşayacak?",
    "Paste your website URL. We'll auto-discover the pages worth indexing.": "Web sitenizin URL'sini yapıştırın. İndekslenmeye değer sayfaları otomatik olarak keşfedeceğiz.",
    "Website URL": "Web Sitesi URL'si",
    "Scanning…": "Taranıyor…",
    "Scan my site": "Sitemi tara",
    "Skip for now": "Şimdilik atla",
    "What kind of site is this?": "Bu ne tür bir site?",
    "We'll tune starter prompts, response style, and capabilities to match. You can change this any time later.": "Başlangıç istemlerini, yanıt stilini ve yetenekleri buna göre ayarlayacağız. Bunu daha sonra istediğiniz zaman değiştirebilirsiniz.",
    "Looking at your homepage…": "Ana sayfanıza bakılıyor…",
    "We're scanning a few signals (page metadata, schema, URL shape) to suggest the best preset.": "En iyi ön ayarı önermek için birkaç sinyali (sayfa meta verileri, şema, URL yapısı) tarıyoruz.",
    "Detection timed out  —  pick a vertical manually.": "Algılama zaman aşımına uğradı — lütfen manuel bir kategori seçin.",
    "Detection failed  —  pick a vertical manually.": "Algılama başarısız oldu — lütfen manuel bir kategori seçin.",
    "Detected:": "Algılanan:",
    "Other possibilities:": "Diğer ihtimaller:",
    "Confirm or pick a different match": "Onaylayın veya farklı bir eşleşme seçin",
    "I'll configure later": "Daha sonra yapılandıracağım",
    "Applying…": "Uygulanıyor…",
    "Use this preset": "Bu ön ayarı kullan",
    "Found :count pages": ":count sayfa bulundu",
    "Pick the ones you want the agent to learn from. You can add more later.": "Asistanın öğrenmesini istediğiniz sayfaları seçin. Daha sonra daha fazlasını ekleyebilirsiniz.",
    "No pages found from sitemap or common paths. You can paste URLs manually on the next page.": "Site haritasından veya ortak yollardan sayfa bulunamadı. Bir sonraki sayfada URL'leri manuel olarak yapıştırabilirsiniz.",
    ":count selected": ":count seçildi",
    "Add :count & continue": ":count ekle ve devam et",
    "Install on your site": "Sitenize kurun",
    "Paste this snippet just before :tag. The widget loads in under 50 KB.": "Bu kod parçacığını :tag etiketinden hemen önce yapıştırın. Widget 50 KB'ın altında yüklenir.",
    "Copy snippet": "Kodu kopyala",
    ":indexed of :total page indexed": ":total sayfanın :indexed adedi indekslendi",
    "Crawling in progress — refreshes every 3 seconds.": "Tarama devam ediyor — her 3 saniyede bir yenilenir.",
    "Add more sources": "Daha fazla kaynak ekle"
}

with open(tr_path, 'r', encoding='utf-8') as f:
    tr_data = json.load(f)

tr_data.update(new_translations)

with open(tr_path, 'w', encoding='utf-8') as f:
    json.dump(tr_data, f, indent=4, ensure_ascii=False)

print(f"Updated {tr_path} with onboarding wizard labels.")
