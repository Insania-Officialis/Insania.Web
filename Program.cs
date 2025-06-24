using System.Text.Json.Serialization;
using System.Text.Json;

using Microsoft.AspNetCore.Http.Json;

using Serilog;

//Создания экземпляра постройки веб-приложения
var builder = WebApplication.CreateBuilder(args);

//Получение сервисов веб-приложения
IServiceCollection services = builder.Services;

//Получение конфигурации веб-приложения
ConfigurationManager configuration = builder.Configuration;

//Добавление параметров сериализации и десериализации json
services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNameCaseInsensitive = false;
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    options.SerializerOptions.WriteIndented = true;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

//Добавление параметров логирования
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Verbose()
    .WriteTo.File(path: configuration["LoggingOptions:FilePath"]!, rollingInterval: RollingInterval.Day)
    .WriteTo.Debug()
    .CreateLogger();
services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(Log.Logger, dispose: true));

//Добавление поддержки веб-страниц с параметрами
services.AddRazorPages(options =>
{
    //Настройка папки по-умолчанию
    options.RootDirectory = "/Zones";

    //Настройка стартовой страницы
    options.Conventions.AddPageRoute("/Start/Views/Authentication", "");
});

services.AddControllersWithViews().AddRazorRuntimeCompilation();

//Построение веб-приложения
var app = builder.Build();

//Подключение перенаправления с http на https
app.UseHttpsRedirection();

//Подключение маршрутизации
app.UseRouting();

//Подключение авторизации
app.UseAuthorization();

//Подключение статических файлов
app.MapStaticAssets();

//Подключение веб-страниц со статическими файлами
app.MapRazorPages().WithStaticAssets();

//Подключение маршрутизации контроллеров
app.MapControllerRoute(name: "default", pattern: "{controller=AuthenticationController}/{action=Index}");

//Запуск веб-приложения
app.Run();
