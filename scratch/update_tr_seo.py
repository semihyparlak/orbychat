import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Comprehensive SEO translations
seo_translations = {
    # Titles
    "{brand} — AI sales assistant for high-intent pages": "{brand} — Yüksek niyetli sayfalar için yapay zeka satış asistanı",
    "Pricing — {brand}": "Fiyatlandırma — {brand}",
    "How it works — {brand}": "Nasıl çalışır — {brand}",
    "Integrations — {brand}": "Entegrasyonlar — {brand}",
    "Privacy policy — {brand}": "Gizlilik politikası — {brand}",
    "Terms of service — {brand}": "Hizmet şartları — {brand}",
    "Changelog — {brand}": "Değişiklik günlüğü — {brand}",
    "Documentation — {brand}": "Dokümantasyon — {brand}",
    "Industry Solutions — {brand}": "Sektörel Çözümler — {brand}",
    "{page_title} — {brand} docs": "{page_title} — {brand} dokümanları",
    "AI Sales Assistant for {page_title} — {brand}": "{page_title} için Yapay Zeka Satış Asistanı — {brand}",
    
    # Descriptions
    "Turn every high-intent page into a sales conversation. The {brand} chat widget answers from your real content, captures leads, and hands off to humans on demand. Self-hostable, multi-tenant, white-labelable.": "Her yüksek niyetli sayfayı bir satış görüşmesine dönüştürün. {brand} sohbet aracı gerçek içeriğinizden yanıt verir, müşteri adaylarını yakalar ve istendiğinde insan operatörlere devreder.",
    "Simple, conversation-based pricing for the {brand} sales AI widget. Free to start; scale as you grow. Monthly or annual billing with transparent per-conversation overage.": "{brand} satış yapay zeka asistanı için basit, görüşme tabanlı fiyatlandırma. Başlamak ücretsizdir; büyüdükçe ölçeklendirin.",
    "See how {brand} turns your existing site content into a 24/7 sales rep — index → embed → converse → capture. From setup to first conversation in under 5 minutes.": "{brand}'in mevcut site içeriğinizi nasıl 7/24 satış temsilcisine dönüştürdüğünü görün — dizine ekle → göm → konuş → yakala.",
    "{brand} connects to Slack, Notion, Google Docs, your CRM via webhooks, and any LLM provider you bring. One platform, your existing stack.": "{brand}; Slack, Notion, Google Dokümanlar, webhook'lar aracılığıyla CRM'iniz ve getirdiğiniz tüm LLM sağlayıcılarına bağlanır.",
    "How {brand} collects, stores, and protects your data. Self-hostable so the data never leaves your infrastructure if you choose.": "{brand}'in verilerinizi nasıl topladığı, sakladığı ve koruduğu. Kendi sunucunuzda barındırılabilir, böylece isterseniz verileriniz asla altyapınızdan çıkmaz.",
    "Terms governing use of {brand}.": "{brand} kullanımını düzenleyen şartlar.",
    "Every release of {brand} — what shipped, what changed, and what is fixed. Subscribe to the JSON feed for an always-current view.": "{brand}'in her sürümü — neler eklendi, neler değişti ve neler düzeltildi.",
    "{brand} documentation — quickstart, embed snippets, knowledge sources, workflows, integrations, and the architecture deep-dive.": "{brand} dokümantasyonu — hızlı başlangıç, gömme kodları, bilgi kaynakları, iş akışları, entegrasyonlar ve mimari inceleme.",
    "Explore how {brand} AI sales assistants can be tailored for your specific industry, from Real Estate to SaaS and beyond.": "{brand} yapay zeka satış asistanlarının Emlak'tan SaaS'a kadar spesifik sektörünüz için nasıl özelleştirilebileceğini keşfedin."
}

for k, v in seo_translations.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json SEO translations updated")
