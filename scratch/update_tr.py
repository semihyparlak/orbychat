import json
import collections

file_path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f, object_pairs_hook=collections.OrderedDict)

# New/Corrected keys
new_keys = {
    "Tailored AI for Every Industry": "Her Sektör İçin Özel Yapay Zeka",
    "Industry Verticals": "Sektörel Çözümler",
    "Industry Solutions": "Sektörel Çözümler",
    "E-commerce store": "E-ticaret",
    "How it works": "Nasıl çalışır",
    "AI Sales Assistant for :industry": ":industry için Yapay Zeka Satış Asistanı",
    "Start growing your :industry business today.": ":industry işinizi bugün büyütmeye başlayın.",
    "Our AI sales assistants are pre-configured with industry-specific knowledge and best practices to ensure the highest conversion rates for your business.": "Yapay zeka satış asistanlarımız, işletmeniz için en yüksek dönüşüm oranlarını sağlamak amacıyla sektöre özgü bilgiler ve en iyi uygulamalarla önceden yapılandırılmıştır.",
    "Dont see your industry?": "Sektörünüzü göremiyor musunuz?",
    "Our AI is flexible and can be trained on any knowledge base. Create a generic agent and watch it learn your business in minutes.": "Yapay zekamız esnektir ve her türlü bilgi tabanı üzerinde eğitilebilir. Genel bir asistan oluşturun ve işletmenizi dakikalar içinde öğrenmesini izleyin.",
    "Get Started Now": "Hemen Başlayın",
    "Learn more": "Daha fazla bilgi al"
}

for k, v in new_keys.items():
    data[k] = v

with open(file_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("tr.json updated successfully")
