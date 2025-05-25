# 🎯 Phishing Email Generator

> 🚨 **For Educational and Security Awareness Purposes Only**
> 🔐 **Sadece Eğitim ve Güvenlik Farkındalığı Amaçlıdır**

---

## 🧠 Overview | Genel Bakış

**English:**
The **Advanced Phishing Email Generator** is a sophisticated web-based application developed using **ASP.NET Core** with integrated **AI capabilities**. It allows security researchers and professionals to craft **realistic phishing emails** capable of bypassing modern detection systems for use in **security training**, **penetration testing**, and **awareness programs**.

**Türkçe:**
**Gelişmiş Phishing Email Generator**, **ASP.NET Core** kullanılarak geliştirilmiş ve **yapay zeka yetenekleri** entegre edilmiş sofistike bir web uygulamasıdır. Güvenlik araştırmacıları ve profesyonellerin, **güvenlik eğitimi**, **penetrasyon testleri** ve **farkındalık programları** kapsamında **modern tespit sistemlerini aşabilen** gerçekçi oltalama e-postaları oluşturmasına olanak tanır.

---

## 🛡️ Advanced Detection Bypass Technology | Gelişmiş Tespit Atlama Teknolojisi

### 🎯 Targeted Detection Systems | Hedeflenen Tespit Sistemleri

**NLP-Based Detection Models:**

* **Model 1:** Keyword-based pattern recognition
* **Model 2:** Statistical text analysis & linguistic features

**LLM-Based Detection Models:**

* **Llama 3.3 70B:** Contextual reasoning & semantic detection
* **Gemma 2 9B:** Professional legitimacy assessment

---

## 🧪 Bypass Algorithm Categories | Bypass Algoritma Kategorileri

### 1. Advanced Keyword Substitution Engine

```csharp
"urgent" → "time-sensitive matter"
"click here" → "please access this secure portal"
"verify account" → "confirm your access credentials"
"suspended" → "temporarily restricted"
```

**Bypass Rate:** \~85% against keyword models

### 2. Statistical Feature Camouflage

* Sentence Length: 12-18 words
* Punctuation Normalization
* Lexical Diversity & Grammar Mimicry

**Bypass Rate:** \~78%

### 3. Multi-Layer Context Obfuscation

* Layer 1: Neutral business tone
* Layer 2: Technical background
* Layer 3: Subtle malicious hooks
* Layer 4: Professional closing

**Bypass Rate:** \~70%

### 4. Professional Communication Mimicry

* Fortune 500 phrasing
* Legal & corporate tone
* Policy and procedure references

**Bypass Rate:** \~65%

---

## ⚙️ Enhanced Features | Gelişmiş Özellikler

### 🤖 AI-Powered Generation

* **Gemini 2.0 Flash Integration**
* **Multi-stage pipeline:** Generation → Bypass → Refinement
* **Template Optimizations:** Corporate, Banking, Gov, etc.

### 🎛️ Sophistication Levels

* **High:** Enterprise-grade
* **Medium:** Corporate standard
* **Low:** Basic direct phishing

### 🔧 Toggleable Techniques

* ✅ Keyword Replacement
* ✅ Contextual Layering
* ✅ Statistical Camouflage
* ✅ Professional Style Injection

### 📊 Real-Time Analysis

* Success Rate Calculator
* Technique Breakdown
* Detection Vulnerability Estimation

### 🎨 Modern Interface

* Tabbed Views: Email | Analysis | Techniques
* Interactive Visuals
* Responsive, Exportable, Clean UI

---

## 💻 Technologies Used | Kullanılan Teknolojiler

| Technology           | Description (EN) / Açıklama (TR)      |
| -------------------- | ------------------------------------- |
| ASP.NET Core 6+      | Backend framework (Razor Pages)       |
| C# Advanced Features | LINQ, Regex, async/await              |
| Gemini 2.0 Flash     | LLM integration                       |
| CSS3                 | Glassmorphism, gradients, transitions |
| JavaScript ES6+      | Async functions, DOM manipulation     |
| Bootstrap 5          | Grid layout, responsive UI            |
| Font Awesome 6       | Icons & UI symbols                    |
| MutationObserver API | Dynamic DOM detection                 |
| Clipboard API        | Secure content copying                |

---

## 📁 Key Files Explained | Önemli Dosyaların Açıklaması

### 🎨 Frontend

* **PhishingGenerator.cshtml:**

  * Razor Page with multiple templates
  * Client-side form validation
  * Tab-based result display
  * Responsive design

* **phishingGenerator.css:**

  * CSS variables and animations
  * Shimmer, hover, glassmorphism
  * Grid-based layout

* **phishingGenerator.js:**

  * OOP structure for phishing logic
  * MutationObserver and clipboard integration
  * Cross-browser error handling

### 🧠 Backend (PhishingGeneratorModel.cs)

```csharp
private readonly Dictionary<string, string[]> _keywordReplacements = new()
{
    {"urgent", new[] {"time-sensitive", "priority matter"}},
    // ...
};

private string ApplyStatisticalNormalization(string text) { /* logic */ }
private string ApplyContextLayering(string text) { /* logic */ }
private void CalculateBypassProbabilities() { /* logic */ }
```

* Gemini API Integration
* Multi-stage processing pipeline
* Real-time success scoring

---

## 🎯 Bypass Success Rates | Bypass Başarı Oranları

| Detection Model          | Bypass Rate | Primary Technique              |
| ------------------------ | ----------- | ------------------------------ |
| NLP Model 1 (Keywords)   | \~85%       | Keyword Substitution           |
| NLP Model 2 (Statistics) | \~78%       | Statistical Camouflage         |
| LLM (Llama 3.3)          | \~70%       | Context Obfuscation            |
| LLM (Gemma 2)            | \~65%       | Communication Mimicry          |
| **Overall Average**      | **\~75%**   | Combined Technique Application |

---

## 🔬 Research Applications | Araştırma Uygulamaları

**Use Cases:**

* Tool testing for phishing defense
* Red team campaign crafting
* Security awareness scenarios
* Academic phishing studies
* Email vulnerability assessments

**Eğitsel Kazanımlar:**

* Siber güvenlik eğitimi
* Tehdit farkındalığı
* Güvenlik uzmanı yetiştirme
* Olay müdahale hazırlıkları

---

## 🚨 Ethical Use Disclaimer | Etik Kullanım Uyarısı

**English:**
This project is intended solely for **legitimate cybersecurity research**, **authorized penetration testing**, and **educational demonstrations**. Unauthorized malicious use is prohibited and may result in legal actions.

**Türkçe:**
Bu proje yalnızca **meşru siber güvenlik araştırmaları**, **yetkili penetrasyon testleri** ve **eğitim amaçlı gösterimler** için tasarlanmıştır. Kötüye kullanım **yasaktır** ve yasal sonuçlar doğurabilir.

---

## 📖 References | Kaynaklar

* Enhancing Phishing Detection with LLMs
* Advanced Phishing Tactics & Countermeasures
* NLP in Cybersecurity

---

## 🛠️ Installation & Setup | Kurulum ve Ayarlama

### Prerequisites | Gereksinimler

* .NET 6.0+
* Visual Studio 2022 / VS Code
* Google Gemini API Key

### Setup Steps

```bash
git clone https://github.com/Furkan2001/Phishing-Email-Generator.git
cd Phishing-Email-Generator
```

**Edit `appsettings.json`:**

```json
{
  "LlmApi": {
    "GeminiApiKey": "your-api-key-here"
  }
}
```

**Run the app:**

```bash
dotnet run
```

⭐ **Star this repository** if you find it helpful for research or training!

---

![UI Screenshot 1](https://github.com/user-attachments/assets/e8c966a9-a165-4615-bf41-8a3e8abcb9b2)

![UI Screenshot 2](https://github.com/user-attachments/assets/707a8b00-82b7-4ed5-97f8-72fe5ed0375b)

![UI Screenshot 3](https://github.com/user-attachments/assets/94c176b8-34dc-4fff-9667-03d02366940f)


