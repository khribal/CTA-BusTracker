var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient();

var app = builder.Build();
var key = builder.Configuration["CtaApiKey"];
const string baseUrl = "https://www.ctabustracker.com/bustime/api/v2";


app.UseDefaultFiles();   // serves index.html at "/"
app.UseStaticFiles();    // serves files from wwwroot

//get all CTA routes

async Task<IResult> Cta(IHttpClientFactory http, string endpoint, string query)
{
    var url = $"{baseUrl}/{endpoint}?key={key}&format=json{query}";
    var json = await http.CreateClient().GetStringAsync(url);
    return Results.Content(json, "application/json");
}

app.MapGet("/api/routes", (IHttpClientFactory http) =>
    Cta(http, "getroutes", ""));

app.MapGet("/api/vehicles", (string rt, IHttpClientFactory http) =>
    Cta(http, "getvehicles", $"&rt={Uri.EscapeDataString(rt)}"));

app.MapGet("/api/directions", (string rt, IHttpClientFactory http) =>
    Cta(http, "getdirections", $"&rt={Uri.EscapeDataString(rt)}"));

app.MapGet("/api/stops", (string rt, string dir, IHttpClientFactory http) =>
    Cta(http, "getstops", $"&rt={Uri.EscapeDataString(rt)}&dir={Uri.EscapeDataString(dir)}"));

app.MapGet("/api/patterns", (string rt, IHttpClientFactory http) =>
    Cta(http, "getpatterns", $"&rt={Uri.EscapeDataString(rt)}"));

app.Run();


