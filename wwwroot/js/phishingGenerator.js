// Phishing Generator JS

document.addEventListener('DOMContentLoaded', function() {
    // Sayfaya ilk girişte form input'una focus yapalım
    document.getElementById('emailPrompt').focus();
    
    // Form gönderildiğinde loading animasyonu gösterelim
    document.getElementById('phishingForm').addEventListener('submit', function() {
        document.getElementById('loadingOverlay').classList.remove('d-none');
        document.querySelector('.generate-btn').setAttribute('disabled', 'disabled');
    });
    
    // E-posta içeriğini formatla
    const emailBody = document.getElementById('emailBody');
    if (emailBody && emailBody.innerHTML.trim() !== '') {
        // E-posta header bilgilerini çıkar
        extractEmailHeaders(emailBody.innerHTML);
        
        // E-posta içeriğini formatla
        formatEmailContent();
        
        // Sonuç bölümünü göster
        document.querySelector('.result-section').classList.remove('d-none');
    }
});

// Email alanını özelleştirme fonksiyonu
function formatEmailContent() {
    const emailBody = document.getElementById('emailBody');
    if (!emailBody) return;
    
    // Mevcut içeriği al
    let content = emailBody.innerHTML;
    
    // E-posta header bilgilerini içerikten temizle
    content = removeHeadersFromContent(content);
    
    // Paragrafları düzgün biçimlendir
    content = content.replace(/<br><br>/g, '</p><p>');
    if (!content.startsWith('<p>')) {
        content = '<p>' + content + '</p>';
    }
    
    // E-posta linklerini düzgün göster
    content = content.replace(/(https?:\/\/[^\s<]+)/g, '<a href="#" class="text-primary">$1</a>');
    
    // Önemli kelimeleri vurgula
    const emphasisWords = ['urgent', 'immediately', 'action required', 'verify', 'confirm', 'security', 'update', 'acil', 'hemen', 'doğrulama', 'güvenlik'];
    emphasisWords.forEach(word => {
        const regex = new RegExp('\\b' + word + '\\b', 'gi');
        content = content.replace(regex, match => `<span class="fw-bold text-danger">${match}</span>`);
    });
    
    emailBody.innerHTML = content;
}

// E-posta header bilgilerini içerikten çıkar
function extractEmailHeaders(content) {
    // From bilgisi için arama
    const fromRegex = /(?:from|gönderen|kimden):\s*([^\n<br>]+)/i;
    const fromMatch = content.match(fromRegex);
    
    // Subject bilgisi için arama
    const subjectRegex = /(?:subject|konu):\s*([^\n<br>]+)/i;
    const subjectMatch = content.match(subjectRegex);
    
    // To bilgisi için arama
    const toRegex = /(?:to|alıcı|kime):\s*([^\n<br>]+)/i;
    const toMatch = content.match(toRegex);
    
    // Eğer değerler bulunduysa UI'da güncelle
    if (fromMatch && fromMatch[1]) {
        document.getElementById('emailFrom').textContent = fromMatch[1].trim();
    }
    
    if (subjectMatch && subjectMatch[1]) {
        document.getElementById('emailSubject').textContent = subjectMatch[1].trim();
    }
    
    if (toMatch && toMatch[1]) {
        document.getElementById('emailTo').textContent = toMatch[1].trim();
    }
}

// E-posta header bilgilerini içerikten temizle
function removeHeadersFromContent(content) {
    // Header satırlarını temizle
    content = content.replace(/(?:from|gönderen|kimden):\s*([^\n<br>]+)(<br>|\n)/i, '');
    content = content.replace(/(?:subject|konu):\s*([^\n<br>]+)(<br>|\n)/i, '');
    content = content.replace(/(?:to|alıcı|kime):\s*([^\n<br>]+)(<br>|\n)/i, '');
    
    // Başlangıçtaki gereksiz boş satırları temizle
    content = content.replace(/^(<br>|\n)+/, '');
    
    return content;
}

// Kopyalama fonksiyonu
function copyToClipboard() {
    // E-posta içeriğini al (from, subject, to bilgileri dahil)
    const from = document.getElementById('emailFrom').textContent;
    const subject = document.getElementById('emailSubject').textContent;
    const to = document.getElementById('emailTo').textContent;
    const body = document.getElementById('emailBody').innerText;
    
    // Tam e-posta içeriğini oluştur
    const fullEmail = `From: ${from}\nSubject: ${subject}\nTo: ${to}\n\n${body}`;
    
    navigator.clipboard.writeText(fullEmail)
        .then(() => {
            // Buton animasyonu
            const copyButton = document.getElementById('copyButton');
            copyButton.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
            copyButton.classList.remove('btn-outline-secondary');
            copyButton.classList.add('btn-success');
            
            // Bildirim göster
            showNotification("Email copied to clipboard!");
            
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy me-1"></i>Copy';
                copyButton.classList.remove('btn-success');
                copyButton.classList.add('btn-outline-secondary');
            }, 2000);
        })
        .catch(err => console.error('Kopyalama başarısız:', err));
}

// Bildirim gösterme fonksiyonu
function showNotification(message) {
    // Bildirim elementi yoksa oluştur
    let notification = document.querySelector('.copy-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.classList.add('copy-notification');
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}