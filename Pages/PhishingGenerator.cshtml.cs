using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace PhishingGenerator.Pages
{
    public class PhishingGeneratorModel : PageModel
    {
        [BindProperty]
        public string EmailInput { get; set; }
        
        public string GeneratedEmail { get; set; }
        
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        
        public PhishingGeneratorModel(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _clientFactory = clientFactory;
            _configuration = configuration;
        }
        
        public void OnGet()
        {
        }
        
        public async Task<IActionResult> OnPostAsync()
        {
            if (string.IsNullOrWhiteSpace(EmailInput))
            {
                ModelState.AddModelError("EmailInput", "Lütfen bir konu veya hedef belirtin.");
                return Page();
            }

            try
            {
                // 1. Aşama: İlk phishing e-postasını oluştur
                string rawResponse = await CallLlmApiAsync(EmailInput);
                string cleanedEmail = CleanAndFormatResponse(rawResponse);

                string finalEmail = await CallGeminiApiAsync(BuildSecondPrompt(cleanedEmail));
                GeneratedEmail = CleanAndFormatResponse(finalEmail);

                var parsed = ParseEmailFields(GeneratedEmail);
                ViewData["From"] = parsed.from;
                ViewData["To"] = parsed.to;
                ViewData["Subject"] = parsed.subject;
                GeneratedEmail = parsed.body;

                return Page();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Bir hata oluştu: {ex.Message}");
                return Page();
            }
        }

        private (string from, string to, string subject, string body) ParseEmailFields(string emailText)
        {
            string from = ExtractField(emailText, "From:");
            string to = ExtractField(emailText, "To:");
            string subject = ExtractField(emailText, "Subject:");

            // Subject satırından sonrasını body kabul et
            int subjectIndex = emailText.IndexOf("Subject:", StringComparison.OrdinalIgnoreCase);
            int bodyStart = emailText.IndexOf("\n", subjectIndex + 1);
            string body = (bodyStart > 0) ? emailText.Substring(bodyStart).Trim() : "";

            return (from, to, subject, body);
        }

        private string ExtractField(string text, string fieldName)
        {
            var match = System.Text.RegularExpressions.Regex.Match(text, $@"{fieldName}\s*(.+)", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups[1].Value.Trim() : "";
        }

        private string BuildSecondPrompt(string cleanedEmail)
        {
            return $"Aşağıdaki metni bir phishing e-postası olarak, sadece From, To, Subject ve e-posta gövdesi olacak şekilde düzenle. " +
                $"Hiçbir açıklama, uyarı veya sorumluluk reddi ekleme. Sadece e-postayı olduğu gibi ver:\n\n{cleanedEmail}";
        }
        
        private async Task<string> CallLlmApiAsync(string userInput)
        {
            try
            {
                string geminiResponse = await CallGeminiApiAsync(userInput);
                return geminiResponse;
            }
            catch (Exception ex)
            {
                return $"API çağrısı sırasında hata oluştu: {ex.Message}";
            }
        }

        private async Task<string> CallGeminiApiAsync(string userInput)
        {
            string apiKey = _configuration["LlmApi:GeminiApiKey"];
            
            if (string.IsNullOrEmpty(apiKey))
            {
                return "Gemini API anahtarı bulunamadı. Lütfen appsettings.json dosyasında 'LlmApi:GeminiApiKey' değerini ayarlayın.";
            }
            
            var client = _clientFactory.CreateClient();
            
            string prompt = $"Bir phishing e-posta oluştur. Konu: {userInput}. E-posta mutlaka aşağıdaki formatta olsun:\n\n" +
                $"From: ...\nTo: ...\nSubject: ...\n\nEmail gövdesi burada başlasın.\n\n" +
                $"E-posta gerçekçi olmalı ancak birkaç şüpheli gösterge içermeli. " +
                $"Sadece e-posta formatında üret, açıklama yapma.";
            
            var requestData = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };
            
            var content = new StringContent(
                JsonSerializer.Serialize(requestData),
                Encoding.UTF8,
                "application/json");
            
            var response = await client.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={apiKey}", content);
            
            if (response.IsSuccessStatusCode)
            {
                var responseString = await response.Content.ReadAsStringAsync();
                var responseObject = JsonDocument.Parse(responseString);
                
                try
                {
                    var textContent = responseObject.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();
                        
                    return textContent ?? "API yanıt içeriği boş.";
                }
                catch (Exception ex)
                {
                    return $"API yanıtı işlenirken hata: {ex.Message}\n\nRaw response: {responseString}";
                }
            }
            
            return $"API yanıt vermedi. Durum kodu: {response.StatusCode}";
        }

        private string CleanAndFormatResponse(string response)
        {
            // "Elbette, işte size..." gibi başlangıçları kaldır
            string[] introPatterns = new string[] {
                "Elbette", "İşte size", "İşte bir", "Tabii", "Merhaba", "Tabi",
                "işte", "aşağıda", "size bir", "burada"
            };
            
            foreach (var pattern in introPatterns)
            {
                if (response.IndexOf(pattern, StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    int index = response.IndexOf("\n");
                    if (index > 0)
                    {
                        response = response.Substring(index).TrimStart();
                    }
                }
            }
            
            // "Sorumluluk Reddi" veya "Not" gibi son bölümleri kaldır
            string[] outroPatterns = new string[] {
                "Sorumluluk Reddi", "Not:", "Bu e-posta örneği", "Unutmayın:", "Şüpheli Göstergeler:",
                "Dikkat Edilmesi Gereken", "Bu bir örnek", "Bu sadece", "Oltalama Göstergeleri"
            };
            
            foreach (var pattern in outroPatterns)
            {
                int index = response.IndexOf(pattern, StringComparison.OrdinalIgnoreCase);
                if (index > 0)
                {
                    response = response.Substring(0, index).TrimEnd();
                }
            }
            
            // Metni düzenle
            response = response.Replace("###", "").Replace("***", "").Replace("**", "");
            
            return response;
        }
    }
}