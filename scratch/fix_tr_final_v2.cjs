const fs = require('fs');
const path = 'lang/tr.json';

// Anahtarlar ve temiz Türkçeleri
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
    "Ask anything about this site.": "Bu site hakkında her şeyi sorabilirsiniz.",
    "What does it cost?": "Fiyatlandırma ne kadar?",
    "How is this different from competitors?": "Rakiplerden farkınız nedir?",
    "Can I try it for free?": "Ücretsiz deneyebilir miyim?",
    "Tell me more about this": "Bana bundan biraz daha bahset",
    "How do I get started?": "Nasıl başlayabilirim?",
    "Can I see a demo?": "Bir demo görebilir miyim?",
    "Leave your details — we'll get back to you": "Bilgilerinizi bırakın — size geri döneceğiz.",
    "Leave your details — we'll get back to you.": "Bilgilerinizi bırakın — size geri döneceğiz.",
    "What do you offer?": "Neler sunuyorsunuz?",
    "Can I see a case study?": "Bir vaka çalışması görebilir miyim?",
    "How do we get started?": "Nasıl başlarız?"
};

// Dosyayı oku
let content = fs.readFileSync(path, 'utf8');
let tr = JSON.parse(content);

// Güncelle
Object.assign(tr, updates);

// Tertemiz JSON bas
fs.writeFileSync(path, JSON.stringify(tr, null, 4), 'utf8');
console.log('tr.json fixed with clean UTF-8');
