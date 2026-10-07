const fs = require('fs');
const path = 'lang/tr.json';
const tr = JSON.parse(fs.readFileSync(path, 'utf8'));

const updates = {
    "AI assistant": "Akıllı Asistan",
    "Live support": "Canlı Destek",
    "Close": "Kapat",
    "Clear conversation": "Sohbeti Temizle",
    "Send": "Gönder",
    "Powered by": "Altyapı:",
    "Ask anything": "Bir şeyler sorun...",
    "Ask about the product": "Size nasıl yardımcı olabilirim?",
    "AI is typing...": "Asistan yazıyor...",
    "Thinking...": "Düşünüyor...",
    "Start voice input": "Sesli komutu başlat",
    "Stop voice input": "Sesli komutu durdur",
    "Voice input not supported in this browser": "Bu tarayıcıda sesli komut desteklenmiyor",
    "Retry": "Tekrar Dene",
    "Copy": "Kopyala",
    "Sources": "Kaynaklar",
    "Live agent": "Müşteri Temsilcisi",
    "Ask anything about this site.": "Bu site hakkında her şeyi sorabilirsiniz."
};

Object.assign(tr, updates);
fs.writeFileSync(path, JSON.stringify(tr, null, 4), 'utf8');
console.log('tr.json updated successfully');
