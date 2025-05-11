var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddHttpClient(); // HttpClient Factory ekle

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Statik dosyalar için

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

// Ana sayfayı PhishingGenerator olarak ayarla
app.MapGet("/", context => {
    context.Response.Redirect("/PhishingGenerator");
    return Task.CompletedTask;
});

app.Run();