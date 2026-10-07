import json

path = r'c:\Users\syp\Downloads\63254777-pitchbar-selfhosted-saas-sales-ai-widget-for-any-website\lang\tr.json'

with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Update the specific keys that mentioned Stripe
updates = {
    "Plug :brand into the tools your team already uses — Notion, Google Docs, Slack, Stripe, webhooks, and more.": "Plug :brand into the tools your team already uses — Notion, Google Docs, Slack, Shopify, webhooks, and more.",
    "Plug :brand into the tools your team already uses  —  Notion, Google Docs, Slack, Stripe, webhooks, and more.": "Plug :brand into the tools your team already uses  —  Notion, Google Docs, Slack, Shopify, webhooks, and more.",
}

new_data = {}
for k, v in data.items():
    new_k = k
    new_v = v
    if "Stripe" in k and "Notion, Google Docs, Slack" in k:
        new_k = k.replace("Stripe", "Shopify")
    if "Stripe" in v and "Notion, Google Dokümanlar, Slack" in v:
        new_v = v.replace("Stripe", "Shopify")
    
    new_data[new_k] = new_v

# Also handle the specific description from MarketingController if it's there
# It was in tr.json as:
# "Plug :brand into the tools your team already uses — Notion, Google Docs, Slack, Stripe, webhooks, and more.": ":brand'i ekibinizin zaten kullandığı araçlara bağlayın — Notion, Google Dokümanlar, Slack, Stripe, webhook'lar ve daha fazlası."

with open(path, 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)

print("Updated tr.json: Replaced Stripe with Shopify in integration lists.")
