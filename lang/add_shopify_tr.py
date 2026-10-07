import json

path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_keys = {
    "Connect your Shopify store to sync products.": "Ürünleri senkronize etmek için Shopify mağazanızı bağlayın.",
    "Connect your Shopify store via Custom App to sync products and answer customer questions about them in real-time.": "Ürünleri senkronize etmek ve onlarla ilgili müşteri sorularını gerçek zamanlı olarak yanıtlamak için Özel Uygulama aracılığıyla Shopify mağazanızı bağlayın.",
    "E-commerce": "E-ticaret",
}

data.update(new_keys)

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Added Shopify marketing strings to tr.json")
