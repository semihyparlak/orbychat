const fs = require('fs');
const path = 'lang/tr.json';

const updates = {
    "Starter prompts": "Başlangıç soruları",
    "Manual questions that visitors can click to quickly start a session.": "Ziyaretçilerin hızlıca sohbet başlatmak için tıklayabileceği manuel sorular.",
    "Add question": "Soru ekle",
    "Define up to 4-5 questions that visitors see at the start of a conversation.": "Ziyaretçilerin sohbet başında göreceği 4-5 adet soru belirleyin.",
    "No starter prompts yet": "Henüz başlangıç sorusu yok",
    "Add questions to help visitors understand what they can ask your agent.": "Ziyaretçilerin asistanınıza neler sorabileceğini anlamalarına yardımcı olmak için sorular ekleyin.",
    "Add your first question": "İlk sorunuzu ekleyin",
    "e.g. What are your pricing plans?": "Örn: Fiyatlandırma planlarınız nelerdir?",
    "Starter prompts updated.": "Başlangıç soruları güncellendi.",
    "Back to agent": "Asistana geri dön",
    "Saving...": "Kaydediliyor...",
    "Save changes": "Değişiklikleri kaydet"
};

let content = fs.readFileSync(path, 'utf8');
let tr = JSON.parse(content);
Object.assign(tr, updates);
fs.writeFileSync(path, JSON.stringify(tr, null, 4), 'utf8');
console.log('tr.json updated with dashboard labels');
