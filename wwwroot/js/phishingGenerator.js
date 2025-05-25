// Global functions for direct calling and debugging
window.copyEmailToClipboard = function() {
    console.log('🌍 Global copyEmailToClipboard called');
    if (window.phishingGenerator && typeof window.phishingGenerator.copyEmailToClipboard === 'function') {
        window.phishingGenerator.copyEmailToClipboard();
    } else {
        console.error('❌ PhishingGenerator instance not found or method missing');
        // Fallback attempt
        window.manualCopyAttempt();
    }
};

window.downloadEmail = function() {
    console.log('🌍 Global downloadEmail called');
    if (window.phishingGenerator && typeof window.phishingGenerator.downloadEmail === 'function') {
        window.phishingGenerator.downloadEmail();
    } else {
        console.error('❌ PhishingGenerator instance not found or method missing');
        // Fallback attempt
        window.manualDownloadAttempt();
    }
};

// Fallback manual methods
window.manualCopyAttempt = function() {
    console.log('🔄 Manual copy attempt');
    try {
        const emailPreview = document.querySelector('.email-preview, .email-body, #emailBody');
        if (emailPreview) {
            const range = document.createRange();
            range.selectNodeContents(emailPreview);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            const copied = document.execCommand('copy');
            if (copied) {
                alert('Email içeriği kopyalandı!');
            } else {
                alert('Kopyalama başarısız. Manuel olarak seçin ve Ctrl+C yapın.');
            }
        } else {
            alert('Email içeriği bulunamadı.');
        }
    } catch (error) {
        console.error('Manual copy failed:', error);
        alert('Kopyalama başarısız: ' + error.message);
    }
};

window.manualDownloadAttempt = function() {
    console.log('🔄 Manual download attempt');
    try {
        const emailContent = document.querySelector('.email-body, #emailBody');
        if (emailContent) {
            const content = emailContent.textContent || emailContent.innerText || 'Email content not found';
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `email_${Date.now()}.txt`;
            a.click();
            
            URL.revokeObjectURL(url);
            alert('Email indirildi!');
        } else {
            alert('Email içeriği bulunamadı.');
        }
    } catch (error) {
        console.error('Manual download failed:', error);
        alert('İndirme başarısız: ' + error.message);
    }
};

// Debug function to check element existence
window.debugEmailElements = function() {
    console.log('🔍 Debug: Checking email elements');
    const elements = {
        emailFrom: document.getElementById('emailFrom'),
        emailTo: document.getElementById('emailTo'),
        emailSubject: document.getElementById('emailSubject'),
        emailBody: document.getElementById('emailBody'),
        copyButton: document.getElementById('copyEmailButton'),
        downloadButton: document.getElementById('downloadButton'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        resultSection: document.getElementById('resultSection')
    };
    
    console.table(Object.entries(elements).map(([key, value]) => ({
        element: key,
        exists: !!value,
        visible: value ? !value.offsetParent === null : false,
        content: value ? (value.textContent || value.innerText || '').substring(0, 50) : 'N/A'
    })));
    
    return elements;
};

// Initialize when DOM is loaded and store instance globally
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Initializing PhishingGenerator');
        window.phishingGenerator = new PhishingGenerator();
        console.log('✅ PhishingGenerator initialized successfully');
        
        // Debug info
        setTimeout(() => {
            console.log('🔍 Post-init debug check');
            window.debugEmailElements();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Failed to initialize PhishingGenerator:', error);
    }
});

// Additional initialization on window load
window.addEventListener('load', () => {
    console.log('🔄 Window load complete, checking PhishingGenerator');
    if (!window.phishingGenerator) {
        console.log('⚠️ PhishingGenerator not found on window load, reinitializing');
        try {
            window.phishingGenerator = new PhishingGenerator();
            console.log('✅ PhishingGenerator reinitialized on window load');
        } catch (error) {
            console.error('❌ Reinitialization failed:', error);
        }
    } else {
        console.log('✅ PhishingGenerator already exists on window load');
        // Rebind events just in case
        setTimeout(() => {
            if (window.phishingGenerator.bindResultsEvents) {
                window.phishingGenerator.bindResultsEvents();
            }
        }, 500);
    }
});// Advanced Phishing Generator JavaScript
class PhishingGenerator {
    constructor() {
        console.log('🚀 PhishingGenerator constructor called');
        
        this.form = document.getElementById('phishingForm');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.resultSection = document.getElementById('resultSection');
        this.generateButton = this.form?.querySelector('.generate-btn');
        
        if (this.generateButton) {
            this.buttonText = this.generateButton.querySelector('.btn-text');
            this.buttonLoader = this.generateButton.querySelector('.btn-loader');
        }
        
        console.log('📋 Elements found:', {
            form: !!this.form,
            loadingOverlay: !!this.loadingOverlay,
            resultSection: !!this.resultSection,
            generateButton: !!this.generateButton
        });
        
        this.init();
    }
    
    init() {
        console.log('🚀 PhishingGenerator init called');
        
        // Wait for full page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
        
        // Also wait for window load for complete resource loading
        if (document.readyState !== 'complete') {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    console.log('🔄 Post-load binding attempt');
                    this.bindResultsEvents();
                }, 500);
            });
        }
    }
    
    initializeComponents() {
        console.log('⚙️ Initializing components');
        
        this.bindEvents();
        this.initializeTabSystem();
        this.setupFormValidation();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
        this.animateOnLoad();
        
        // Check if results already exist (page refresh scenario)
        const resultSection = document.getElementById('resultSection');
        if (resultSection && !resultSection.classList.contains('d-none')) {
            console.log('📄 Results section found on init, binding events');
            setTimeout(() => this.bindResultsEvents(), 200);
        }
        
        console.log('✅ Components initialized');
    }
    
    bindEvents() {
        console.log('🔗 Binding events');
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            console.log('✅ Form submit event bound');
        }
        
        // Use MutationObserver to watch for dynamically added elements
        this.setupMutationObserver();
        
        // Immediate binding for existing elements
        this.bindResultsEvents();
        
        // Template change handler
        const emailTemplate = document.getElementById('emailTemplate');
        if (emailTemplate) {
            emailTemplate.addEventListener('change', (e) => this.handleTemplateChange(e));
        }
        
        // Sophistication level change
        const sophisticationLevel = document.getElementById('sophisticationLevel');
        if (sophisticationLevel) {
            sophisticationLevel.addEventListener('change', (e) => this.handleSophisticationChange(e));
        }
        
        // Advanced options toggles
        this.setupAdvancedOptionsHandlers();
    }
    
    setupMutationObserver() {
        // Watch for changes in the DOM to catch dynamically loaded content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if results section was added/modified
                            if (node.id === 'resultSection' || node.querySelector('#resultSection')) {
                                console.log('📄 Results section detected, binding events');
                                setTimeout(() => this.bindResultsEvents(), 100);
                            }
                            
                            // Check for tab content
                            if (node.classList && node.classList.contains('tab-content')) {
                                setTimeout(() => this.bindResultsEvents(), 100);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ MutationObserver setup complete');
    }
    
    bindResultsEvents() {
        console.log('🎯 Binding results events');
        
        // Copy email button
        const copyButton = document.getElementById('copyEmailButton');
        if (copyButton && !copyButton.hasAttribute('data-event-bound')) {
            copyButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📋 Copy button clicked');
                this.copyEmailToClipboard();
            });
            copyButton.setAttribute('data-event-bound', 'true');
            console.log('✅ Copy button event bound');
        }
        
        // Download button
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton && !downloadButton.hasAttribute('data-event-bound')) {
            downloadButton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('💾 Download button clicked');
                this.downloadEmail();
            });
            downloadButton.setAttribute('data-event-bound', 'true');
            console.log('✅ Download button event bound');
        }
        
        // Tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn:not([data-event-bound])');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📑 Tab button clicked:', button.dataset.tab);
                this.handleTabClick(button);
            });
            button.setAttribute('data-event-bound', 'true');
        });
        
        if (tabButtons.length > 0) {
            console.log(`✅ ${tabButtons.length} tab buttons bound`);
        }
    }
    
    setupAdvancedOptionsHandlers() {
        const checkboxes = document.querySelectorAll('.advanced-options input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleAdvancedOptionChange(e));
        });
    }
    
    handleAdvancedOptionChange(event) {
        const checkbox = event.target;
        const label = checkbox.nextElementSibling;
        
        if (checkbox.checked) {
            label.classList.add('text-primary');
            this.showNotification(`${checkbox.id} aktivleştirildi`, 'success');
        } else {
            label.classList.remove('text-primary');
            this.showNotification(`${checkbox.id} devre dışı bırakıldı`, 'info');
        }
        
        this.updateBypassEstimate();
    }
    
    updateBypassEstimate() {
        const activeOptions = document.querySelectorAll('.advanced-options input[type="checkbox"]:checked').length;
        const baseSuccess = 35;
        const bonusPerOption = 12;
        const estimatedSuccess = Math.min(95, baseSuccess + (activeOptions * bonusPerOption));
        
        // Update any UI elements showing bypass estimate
        const estimateElements = document.querySelectorAll('.bypass-estimate');
        estimateElements.forEach(element => {
            element.textContent = `~${estimatedSuccess}%`;
        });
    }
    
    async handleFormSubmit(event) {
        event.preventDefault();
        console.log('🔄 Form submission started');
        
        if (!this.validateForm()) {
            console.log('❌ Form validation failed');
            return;
        }
        
        this.showLoading();
        
        try {
            // Chrome'da form submission için normal form submit kullan
            console.log('📤 Submitting form normally for Chrome compatibility');
            
            // Form'u normal şekilde submit et (AJAX yerine)
            this.form.submit();
            
        } catch (error) {
            console.error('❌ Form submission error:', error);
            this.hideLoading();
            this.showNotification('Bir hata oluştu: ' + error.message, 'error');
        }
    }
    
    validateForm() {
        const emailInput = document.getElementById('emailPrompt');
        const errors = [];
        
        if (!emailInput.value.trim()) {
            errors.push('Email senaryosu gerekli');
            emailInput.classList.add('error-shake');
            setTimeout(() => emailInput.classList.remove('error-shake'), 500);
        }
        
        if (emailInput.value.trim().length < 10) {
            errors.push('Email senaryosu çok kısa (minimum 10 karakter)');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join('\n'), 'error');
            return false;
        }
        
        return true;
    }
    
    showLoading() {
        this.loadingOverlay.classList.remove('d-none');
        this.generateButton.disabled = true;
        this.buttonText.classList.add('d-none');
        this.buttonLoader.classList.remove('d-none');
        
        // Animate loading text
        this.animateLoadingText();
    }
    
    hideLoading() {
        this.loadingOverlay.classList.add('d-none');
        this.generateButton.disabled = false;
        this.buttonText.classList.remove('d-none');
        this.buttonLoader.classList.add('d-none');
    }
    
    animateLoadingText() {
        const messages = [
            'AI analiz ediyor...',
            'Bypass teknikleri uygulanıyor...',
            'Sofistikasyon seviyesi ayarlanıyor...',
            'Detection pattern\'leri analiz ediliyor...',
            'Professional mimicry uygulanıyor...',
            'Son dokunuşlar yapılıyor...'
        ];
        
        let currentIndex = 0;
        const loadingText = this.loadingOverlay.querySelector('p');
        
        const interval = setInterval(() => {
            if (this.loadingOverlay.classList.contains('d-none')) {
                clearInterval(interval);
                return;
            }
            
            loadingText.textContent = messages[currentIndex];
            currentIndex = (currentIndex + 1) % messages.length;
        }, 2000);
    }
    
    handleTabClick(button) {
        const targetTab = button.dataset.tab;
        
        // Remove active from all buttons and contents
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active to clicked button and corresponding content
        button.classList.add('active');
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
            // Animate tab content
            this.animateTabContent(targetTab);
        }
    }
    
    initializeTabSystem() {
        // Tab system is now handled by event delegation in bindEvents()
        // This method can be used for any initialization if needed
        const firstTab = document.querySelector('.tab-btn');
        if (firstTab && !document.querySelector('.tab-btn.active')) {
            firstTab.classList.add('active');
            const firstContent = document.querySelector('.tab-content');
            if (firstContent) {
                firstContent.classList.add('active');
            }
        }
    }
    
    animateTabContent(tabName) {
        const tabContent = document.getElementById(`${tabName}-tab`);
        tabContent.classList.add('fade-in');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            tabContent.classList.remove('fade-in');
        }, 600);
        
        // Special animations for specific tabs
        if (tabName === 'analysis') {
            this.animateProgressBars();
        } else if (tabName === 'techniques') {
            this.animateTechniqueBadges();
        }
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.prob-fill');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }, index * 200);
        });
    }
    
    animateTechniqueBadges() {
        const badges = document.querySelectorAll('.technique-badge');
        badges.forEach((badge, index) => {
            setTimeout(() => {
                badge.classList.add('slide-in');
            }, index * 100);
        });
    }
    
    async copyEmailToClipboard() {
        console.log('📋 Copy email function called');
        
        try {
            // Element kontrolü ile detaylı logging
            const emailFromElement = document.getElementById('emailFrom');
            const emailToElement = document.getElementById('emailTo');  
            const emailSubjectElement = document.getElementById('emailSubject');
            const emailBodyElement = document.getElementById('emailBody');
            
            console.log('🔍 Email elements check:', {
                from: !!emailFromElement,
                to: !!emailToElement,
                subject: !!emailSubjectElement,
                body: !!emailBodyElement
            });
            
            if (!emailFromElement || !emailToElement || !emailSubjectElement || !emailBodyElement) {
                // Alternatif element seçimi dene
                const alternativeElements = this.findEmailElements();
                if (!alternativeElements.success) {
                    throw new Error('Email elements not found in DOM');  
                }
                console.log('✅ Found alternative email elements');
            }
            
            // Text içerik al
            let emailFrom, emailTo, emailSubject, emailBody;
            
            if (emailFromElement) {
                emailFrom = this.getTextContent(emailFromElement);
            }
            if (emailToElement) {
                emailTo = this.getTextContent(emailToElement);
            }
            if (emailSubjectElement) {
                emailSubject = this.getTextContent(emailSubjectElement);
            }
            if (emailBodyElement) {
                emailBody = this.getTextContent(emailBodyElement);
            }
            
            console.log('📝 Email content extracted:', {
                fromLength: emailFrom?.length || 0,
                toLength: emailTo?.length || 0,
                subjectLength: emailSubject?.length || 0,
                bodyLength: emailBody?.length || 0
            });
            
            const fullEmail = `From: ${emailFrom || 'N/A'}\nTo: ${emailTo || 'N/A'}\nSubject: ${emailSubject || 'N/A'}\n\n${emailBody || 'N/A'}`;
            
            // Clipboard'a kopyala - multiple methods
            let copySuccess = false;
            
            // Method 1: Modern Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(fullEmail);
                    copySuccess = true;
                    console.log('✅ Copied using Clipboard API');
                } catch (err) {
                    console.log('❌ Clipboard API failed:', err);
                }
            }
            
            // Method 2: Fallback method
            if (!copySuccess) {
                copySuccess = this.fallbackCopyToClipboard(fullEmail);
            }
            
            if (copySuccess) {
                this.showCopySuccess();
                this.showNotification('Email başarıyla panoya kopyalandı!', 'success');
                console.log('✅ Copy operation successful');
            } else {
                throw new Error('All copy methods failed');
            }
            
        } catch (error) {
            console.error('❌ Copy operation failed:', error);
            this.showNotification('Kopyalama başarısız: ' + error.message, 'error');
            
            // Son çare: Manuel kopyalama için email'i seç
            this.selectEmailForManualCopy();
        }
    }
    
    getTextContent(element) {
        if (!element) return '';
        
        // innerHTML'den br taglerini \n'e çevir
        let content = element.innerHTML;
        content = content.replace(/<br\s*\/?>/gi, '\n');
        content = content.replace(/<\/p>/gi, '\n');
        content = content.replace(/<p[^>]*>/gi, '');
        content = content.replace(/<[^>]*>/g, ''); // Diğer HTML taglerini kaldır
        
        // Alternatif olarak textContent/innerText dene
        if (!content.trim()) {
            content = element.textContent || element.innerText || '';
        }
        
        return content.trim();
    }
    
    findEmailElements() {
        // Alternatif selector'lar dene
        const selectors = [
            '[id*="emailFrom"], [class*="emailFrom"], [data-field="from"]',
            '[id*="emailTo"], [class*="emailTo"], [data-field="to"]', 
            '[id*="emailSubject"], [class*="emailSubject"], [data-field="subject"]',
            '[id*="emailBody"], [class*="emailBody"], [data-field="body"]'
        ];
        
        const elements = {};
        selectors.forEach((selector, index) => {
            const element = document.querySelector(selector);
            const keys = ['from', 'to', 'subject', 'body'];
            elements[keys[index]] = element;
        });
        
        const success = Object.values(elements).some(el => el !== null);
        return { success, elements };
    }
    
    fallbackCopyToClipboard(text) {
        console.log('🔄 Using fallback copy method');
        
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            textArea.style.opacity = '0';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, 99999); // Mobile support
            
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            console.log('📋 Fallback copy result:', successful);
            return successful;
            
        } catch (error) {
            console.error('❌ Fallback copy failed:', error);
            return false;
        }
    }
    
    showCopySuccess() {
        const copyButton = document.getElementById('copyEmailButton');
        if (copyButton) {
            const originalHTML = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check me-1"></i>Kopyalandı!';
            copyButton.classList.add('success-flash');
            
            setTimeout(() => {
                copyButton.innerHTML = originalHTML;
                copyButton.classList.remove('success-flash');
            }, 2500);
        }
    }
    
    selectEmailForManualCopy() {
        // Email preview'i seç ki kullanıcı manuel kopyalayabilsin
        const emailPreview = document.querySelector('.email-preview');
        if (emailPreview) {
            const range = document.createRange();
            range.selectNodeContents(emailPreview);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            this.showNotification('Email içeriği seçildi. Ctrl+C ile kopyalayabilirsiniz.', 'info');
        }
    }
    
    downloadEmail() {
        console.log('💾 Download email function called');
        
        try {
            // Element kontrolü
            const emailFromElement = document.getElementById('emailFrom');
            const emailToElement = document.getElementById('emailTo');
            const emailSubjectElement = document.getElementById('emailSubject');
            const emailBodyElement = document.getElementById('emailBody');
            
            console.log('🔍 Download - Email elements check:', {
                from: !!emailFromElement,
                to: !!emailToElement,
                subject: !!emailSubjectElement,
                body: !!emailBodyElement
            });
            
            if (!emailFromElement || !emailToElement || !emailSubjectElement || !emailBodyElement) {
                throw new Error('Email elements not found for download');
            }
            
            const emailFrom = this.getTextContent(emailFromElement);
            const emailTo = this.getTextContent(emailToElement);
            const emailSubject = this.getTextContent(emailSubjectElement);
            const emailBody = this.getTextContent(emailBodyElement);
            
            const fullEmail = `From: ${emailFrom}\nTo: ${emailTo}\nSubject: ${emailSubject}\n\n${emailBody}`;
            
            // BOM ekleyerek UTF-8 encoding sağla
            const BOM = '\uFEFF';
            const emailWithBOM = BOM + fullEmail;
            
            // Blob oluştur
            const blob = new Blob([emailWithBOM], { 
                type: 'text/plain;charset=utf-8' 
            });
            
            // Download link oluştur
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
            const fileName = `phishing_email_${timestamp}.txt`;
            
            // Download işlemi
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = fileName;
            downloadLink.style.display = 'none';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Cleanup
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
            
            // Visual feedback
            this.showDownloadSuccess();
            this.showNotification(`Email "${fileName}" olarak indirildi!`, 'success');
            console.log('✅ Download successful:', fileName);
            
        } catch (error) {
            console.error('❌ Download failed:', error);
            this.showNotification('İndirme başarısız: ' + error.message, 'error');
        }
    }
    
    showDownloadSuccess() {
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            const originalHTML = downloadButton.innerHTML;
            downloadButton.innerHTML = '<i class="fas fa-check me-1"></i>İndirildi!';
            downloadButton.classList.add('success-flash');
            
            setTimeout(() => {
                downloadButton.innerHTML = originalHTML;
                downloadButton.classList.remove('success-flash');
            }, 2500);
        }
    }
    
    handleTemplateChange(event) {
        const template = event.target.value;
        const descriptions = {
            'corporate': 'Kurumsal IT güvenlik bildirimleri için optimize edildi',
            'banking': 'Banka güvenlik uyarıları için tasarlandı',
            'social': 'Sosyal medya hesap bildirimleri tarzında',
            'ecommerce': 'E-ticaret sipariş/ödeme bildirimleri için',
            'government': 'Resmi kurum bildirimleri formatında',
            'healthcare': 'Sağlık kuruluşu randevu/bilgi sistemleri için'
        };
        
        this.showNotification(`Template değiştirildi: ${descriptions[template]}`, 'info');
    }
    
    handleSophisticationChange(event) {
        const level = event.target.value;
        const descriptions = {
            'high': 'Fortune 500 seviyesi profesyonel dil kullanılacak',
            'medium': 'Standart kurumsal iletişim seviyesi',
            'low': 'Basit ve doğrudan yaklaşım'
        };
        
        this.showNotification(`Sofistikasyon seviyesi: ${descriptions[level]}`, 'info');
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Bu alan gerekli';
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Geçerli bir email adresi girin';
        }
        
        if (field.id === 'emailPrompt' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'En az 10 karakter gerekli';
        }
        
        this.setFieldValidation(field, isValid, errorMessage);
        return isValid;
    }
    
    setFieldValidation(field, isValid, errorMessage) {
        const existingError = field.parentNode.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }
        
        if (!isValid) {
            field.classList.add('is-invalid');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error text-danger small mt-1';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    }
    
    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    setupAutoSave() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.autoSaveFormData();
            });
        });
        
        // Load saved data on page load
        this.loadSavedFormData();
    }
    
    autoSaveFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Also save checkbox states
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            data[checkbox.name] = checkbox.checked;
        });
        
        localStorage.setItem('phishingGeneratorData', JSON.stringify(data));
    }
    
    loadSavedFormData() {
        const savedData = localStorage.getItem('phishingGeneratorData');
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key];
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                this.updateBypassEstimate();
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to submit form
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.form.dispatchEvent(new Event('submit'));
            }
            
            // Ctrl+C to copy email (when result is visible)
            if (e.ctrlKey && e.key === 'c' && !this.resultSection.classList.contains('d-none')) {
                e.preventDefault();
                this.copyEmailToClipboard();
            }
            
            // Tab navigation for tabs (Ctrl+1, Ctrl+2, Ctrl+3)
            if (e.ctrlKey && ['1', '2', '3'].includes(e.key)) {
                e.preventDefault();
                const tabButtons = document.querySelectorAll('.tab-btn');
                const tabIndex = parseInt(e.key) - 1;
                if (tabButtons[tabIndex]) {
                    tabButtons[tabIndex].click();
                }
            }
        });
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    animateOnLoad() {
        // Animate cards on page load
        const cards = document.querySelectorAll('.generator-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 200);
        });
        
        // Animate form elements
        const formElements = document.querySelectorAll('.form-group, .form-group-full');
        formElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('slide-in');
            }, 500 + (index * 100));
        });
    }
}

// Global functions for backward compatibility and direct calling
window.copyEmailToClipboard = function() {
    if (window.phishingGenerator) {
        window.phishingGenerator.copyEmailToClipboard();
    } else {
        console.error('PhishingGenerator instance not found');
    }
};

window.downloadEmail = function() {
    if (window.phishingGenerator) {
        window.phishingGenerator.downloadEmail();
    } else {
        console.error('PhishingGenerator instance not found');
    }
};

// Initialize when DOM is loaded and store instance globally
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.phishingGenerator = new PhishingGenerator();
        console.log('PhishingGenerator initialized successfully');
    } catch (error) {
        console.error('Failed to initialize PhishingGenerator:', error);
    }
});