var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddHttpClient(); // HttpClient Factory servisi - API çağrıları için

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Statik dosyaları (CSS, JS) servis etmek için

app.UseRouting();

app.UseAuthorization();

// Ana sayfayı PhishingGenerator yapmak için
app.MapRazorPages().RequireHost("*");

// Varsayılan sayfayı değiştirmek için bu kısmı ekleyin
app.MapGet("/", context => {
    context.Response.Redirect("/PhishingGenerator");
    return Task.CompletedTask;
});

app.Run();