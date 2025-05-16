# 🎯 Phishing Email Generator

> 🚨 **For Educational and Security Awareness Purposes Only**  
> 🔐 **Sadece Eğitim ve Güvenlik Farkındalığı Amaçlıdır**

---

## 🧠 Overview | Genel Bakış

**English:**  
The **Phishing Email Generator** is a web-based application developed using ASP.NET Core. It enables users to create realistic phishing email templates for security training and awareness programs.

**Türkçe:**  
**Phishing Email Generator**, ASP.NET Core kullanılarak geliştirilmiş web tabanlı bir uygulamadır. Kullanıcıların güvenlik eğitimi ve farkındalık programları için gerçekçi oltalama e-posta şablonları oluşturmasına olanak tanır.

---

## ⚙️ Features | Özellikler

- **Customizable Templates | Özelleştirilebilir Şablonlar**  
  Create emails with personalized content, including subject lines, body text, and sender information.

- **User-Friendly Interface | Kullanıcı Dostu Arayüz**  
  Intuitive design for easy navigation and template creation.

- **Real-Time Preview | Gerçek Zamanlı Önizleme**  
  View the email as it would appear in a recipient's inbox.

- **Export Options | Dışa Aktarma Seçenekleri**  
  Save generated emails in various formats for testing and training purposes.  
  📖 [Source: Enhancing Phishing Email Identification with Large Language Models](https://www.researchgate.net/publication/388847613_Enhancing_Phishing_Email_Identification_with_Large_Language_Models?utm_source=chatgpt.com)

---

## 💻 Technologies Used | Kullanılan Teknolojiler

| Technology         | Description / Açıklama |
|--------------------|-------------------------|
| ASP.NET Core Razor Pages | Lightweight and powerful framework for web apps |
| C# (.NET 6+)       | Backend logic and email data model implementation |
| HTML & Bootstrap   | Responsive and clean frontend design |
| Dependency Injection | IHttpClientFactory & IConfiguration for services |
| Razor Syntax       | For data binding and component generation |
| Visual Studio      | Main IDE used in development |

---

## 📁 Key Files Explained | Önemli Dosyaların Açıklaması

### [`PhishingGenerator.cshtml`](https://github.com/Furkan2001/Phishing-Email-Generator/blob/main/Pages/PhishingGenerator.cshtml)

This Razor Page is responsible for rendering the **form interface** that collects phishing email inputs from the user, including:
- `From`, `To`, `Subject`, and `Body` fields.
- Displays a live preview of the formatted email using Razor templating.
- Uses conditional rendering and `bind` expressions for dynamic form handling.

**Türkçe Açıklama:**  
Kullanıcının doldurabileceği e-posta formu (Gönderen, Alıcı, Konu, İçerik) burada HTML + Razor ile oluşturulmuştur. Sayfa içi veri bağlama (binding) sayesinde formda yapılan değişiklikler otomatik olarak canlı önizleme alanına yansır.

---

### [`PhishingGenerator.cshtml.cs`](https://github.com/Furkan2001/Phishing-Email-Generator/blob/main/Pages/PhishingGenerator.cshtml.cs)

This is the **code-behind file** for the Razor page. It contains:
- Dependency Injection setup (`IHttpClientFactory`, `IConfiguration`)
- `BindProperty` attributes that allow form data to persist between requests.
- Optional logic for exporting, sending, or logging the generated phishing email templates.

**Türkçe Açıklama:**  
Bu dosya, Razor sayfasının arka plan kodlarını içerir. `PhishingEmailModel` sınıfı, kullanıcıdan alınan verilerin işlenmesini ve sayfa ile veri arasında bağ kurulmasını sağlar. `BindProperty` sayesinde formdaki değerler otomatik olarak sınıfa bağlanır. Ayrıca, yapılandırma ve istemci servisleri için dependency injection kullanılmıştır.

---


![Ekran Resmi 2025-05-11 12 08 14](https://github.com/user-attachments/assets/e8c966a9-a165-4615-bf41-8a3e8abcb9b2)

![Ekran Resmi 2025-05-11 12 05 00](https://github.com/user-attachments/assets/4bceb2c8-efdf-4091-ba6f-05087b1bd123)
