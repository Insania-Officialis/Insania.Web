using System.Text.Json.Serialization;
using System.Text.Json;

using Microsoft.AspNetCore.Http.Json;

using Serilog;

//�������� ���������� ��������� ���-����������
var builder = WebApplication.CreateBuilder(args);

//��������� �������� ���-����������
IServiceCollection services = builder.Services;

//��������� ������������ ���-����������
ConfigurationManager configuration = builder.Configuration;

//���������� ���������� ������������ � �������������� json
services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNameCaseInsensitive = false;
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
    options.SerializerOptions.WriteIndented = true;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

//���������� ���������� �����������
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Verbose()
    .WriteTo.File(path: configuration["LoggingOptions:FilePath"]!, rollingInterval: RollingInterval.Day)
    .WriteTo.Debug()
    .CreateLogger();
services.AddLogging(loggingBuilder => loggingBuilder.AddSerilog(Log.Logger, dispose: true));

//���������� ��������� ���-������� � �����������
services.AddRazorPages(options =>
{
    //��������� ����� ��-���������
    options.RootDirectory = "/Zones";

    //��������� ��������� ��������
    options.Conventions.AddPageRoute("/Start/Views/Authentication", "");
});

//���������� ���-����������
var app = builder.Build();

//����������� ��������������� � http �� https
app.UseHttpsRedirection();

//����������� �������������
app.UseRouting();

//����������� �����������
app.UseAuthorization();

//����������� ����������� ������
app.MapStaticAssets();

//����������� ���-������� �� ������������ �������
app.MapRazorPages().WithStaticAssets();

//����������� ������������� ������������
app.MapControllerRoute(name: "default", pattern: "{controller=AuthenticationController}/{action=Index}");

//������ ���-����������
app.Run();
