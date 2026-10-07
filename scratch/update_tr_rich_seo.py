import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# Richer, more professional SEO content for Home and beyond
rich_seo = {
    # Home Page
    "{brand} — AI sales assistant for high-intent pages": "{brand} — Satış Odaklı Yapay Zeka Asistanı ve Müşteri Yakalama Aracı",
    "Turn every high-intent page into a sales conversation. The {brand} chat widget answers from your real content, captures leads, and hands off to humans on demand. Self-hostable, multi-tenant, white-labelable.": "Web sitenize gelen ziyaretçileri gerçek müşterilere dönüştürün. {brand}, içeriğinizi saniyeler içinde öğrenir, soruları yanıtlar ve satış potansiyeli yüksek ziyaretçileri anında yakalar. İşletmenizi 7/24 büyüten profesyonel yapay zeka çözümü.",
    
    # Pricing
    "Pricing — {brand}": "Fiyatlandırma ve Paketler — {brand}",
    "Simple, conversation-based pricing for the {brand} sales AI widget. Free to start; scale as you grow. Monthly or annual billing with transparent per-conversation overage.": "{brand} için basit ve şeffaf fiyatlandırma. Ücretsiz başlayın, işletmeniz büyüdükçe ölçeklendirin. Gizli ücret yok, sadece kullandığınız kadar ödeyin.",
    
    # How it works
    "How it works — {brand}": "Nasıl Çalışır? — {brand}",
    "See how {brand} turns your existing site content into a 24/7 sales rep — index → embed → converse → capture. From setup to first conversation in under 5 minutes.": "{brand}'in mevcut site içeriğinizi nasıl 7/24 çalışan bir satış temsilcisine dönüştürdüğünü keşfedin. Kurulumdan ilk görüşmeye sadece 5 dakika.",
    
    # Integrations
    "Integrations — {brand}": "Entegrasyonlar ve Bağlantılar — {brand}",
    "{brand} connects to Slack, Notion, Google Docs, your CRM via webhooks, and any LLM provider you bring. One platform, your existing stack.": "{brand}; Slack, Notion, Google Dokümanlar ve CRM sistemlerinizle tam uyumlu çalışır. Mevcut iş akışınızı yapay zeka ile güçlendirin.",

    # Industry Solutions
    "Industry Solutions — {brand}": "Sektörel Yapay Zeka Çözümleri — {brand}",
    "Explore how {brand} AI sales assistants can be tailored for your specific industry, from Real Estate to SaaS and beyond.": "Emlak'tan E-ticaret'e, SaaS'tan Sağlık'a kadar sektörünüze özel yapılandırılmış yapay zeka asistanlarını keşfedin."
}

for k, v in rich_seo.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json updated with rich SEO content")
