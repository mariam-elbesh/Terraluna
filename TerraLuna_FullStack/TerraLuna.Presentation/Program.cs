using TerraLuna.Business.Interfaces;
using TerraLuna.Business.Services;
using TerraLuna.Data.Interfaces;
using TerraLuna.Data.Repositories;

namespace TerraLuna.Presentation
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Keep hosting diagnostics on the console; this also makes local CLI hosting
            // work where the Windows Event Log is not writable.
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();

            // Controllers & OpenAPI
            builder.Services.AddControllers().AddJsonOptions(options =>
                options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);
            builder.Services.AddOpenApi();

            // CORS for any external frontend client
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
            });

            // Register Data & Business layers (Clean 3-Layer DI)
            var dataPath = Path.Combine(builder.Environment.ContentRootPath, "Data", "terraluna_nasa_data.json");
            builder.Services.AddSingleton<ITerraLunaRepository>(_ => new JsonTerraLunaRepository(dataPath));
            builder.Services.AddScoped<IAnalogMatchingService, AnalogMatchingService>();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowFrontend");

            // Serve integrated Frontend from wwwroot
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseAuthorization();
            app.MapControllers();
            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}
