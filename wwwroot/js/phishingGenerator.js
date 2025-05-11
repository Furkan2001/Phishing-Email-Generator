// Phishing Generator JS

// Email alanını özelleştirme fonksiyonu - LLM'den gelen yanıtı biçimlendirir
function formatEmailContent(content) {
    // Bu fonksiyon LLM'den gelen yanıtı işleyerek email formatında görüntülenmesini sağlar
    
    // Örnek: İlk satırı konu olarak ayarlamak için
    const lines = content.split('\n');
    let subject = '';
    let body = content;
    
    // Eğer yanıtta "Subject:" veya "Konu:" gibi bir alan varsa
    const subjectMatch = content.match(/(?:Subject|Konu):(.+?)(?:\n|$)/i);
    if (subjectMatch && subjectMatch[1]) {
        subject = subjectMatch[1].trim();
        
        // Konu satırını body'den çıkaralım
        body = body.replace(/(?:Subject|Konu):(.+?)(?:\n|$)/i, '');
    }
    
    // From alanını kontrol edelim
    const fromMatch = content.match(/(?:From|Kimden):(.+?)(?:\n|$)/i);
    if (fromMatch && fromMatch[1]) {
        const from = fromMatch[1].trim();
        document.getElementById('emailFrom').textContent = from;
        
        // From satırını body'den çıkaralım
        body = body.replace(/(?:From|Kimden):(.+?)(?:\n|$)/i, '');
    }
    
    // Subject alanını güncelleyelim
    if (subject) {
        document.getElementById('emailSubject').textContent = subject;
    }
    
    // Linkleri vurgulayalım
    body = body.replace(/(https?:\/\/[^\s]+)/g, '<a href="#" class="text-primary">$1</a>');
    
    // Önemli kelimeleri vurgulayalım
    const emphasisWords = ['urgent', 'immediately', 'action required', 'verify', 'confirm', 'security', 'update', 'acil', 'hemen', 'doğrulama', 'güvenlik'];
    emphasisWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        body = body.replace(regex, match => `<span class="fw-bold text-danger">${match}</span>`);
    });
    
    return body;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    // Email içeriği varsa biçimlendirelim
    const emailBody = document.getElementById('emailBody');
    if (emailBody && emailBody.innerHTML.trim() !== '') {
        const formattedContent = formatEmailContent(emailBody.innerText);
        emailBody.innerHTML = formattedContent;
    }
    
    // Form gönderildiğinde yükleniyor animasyonu
    const form = document.getElementById('phishingForm');
    if (form) {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Generating...';
            submitBtn.disabled = true;
        });
    }
});