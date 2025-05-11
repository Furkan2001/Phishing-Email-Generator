using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PhishingGenerator.Pages  // Bu namespace'i kullandığınızdan emin olun
{
    public class PhishingGeneratorModel : PageModel
    {
        [BindProperty]
        public string EmailInput { get; set; }
        
        public string GeneratedEmail { get; set; }
        
        // HttpClient ve IConfiguration servisleri için düzeltme
        private readonly IHttpClientFactory _clientFactory;
        private readonly IConfiguration _configuration;
        
        // Constructor - dependency injection için
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
                GeneratedEmail = await CallLlmApiAsync(EmailInput);
                return Page();
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, $"Bir hata oluştu: {ex.Message}");
                return Page();
            }
        }
        
        private async Task<string> CallLlmApiAsync(string userInput)
        {
            // API çağrı kodu - basitleştirilmiş örnek
            await Task.Delay(1000); // Test için gecikme
            
            return "Bu bir test yanıtıdır. Gerçek API çağrısı burada yapılacak.";
        }
    }
}