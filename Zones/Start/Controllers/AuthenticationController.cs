using Microsoft.AspNetCore.Mvc;

namespace Insania.Web.Zones.Start.Controllers;

/// <summary>
/// Контроллер работы с аутентификацией
/// </summary>
/// <param cref="ILogger{AuthenticationController}" name="logger">Сервис логгирования</param>
[Route("authentication")]
public class AuthenticationController(ILogger<AuthenticationController> logger) : Controller
{
    #region Зависимости
    /// <summary>
    /// Сервис логгирования
    /// </summary>
    private readonly ILogger<AuthenticationController> _logger = logger;
    #endregion

    #region Методы
    /// <summary>
    /// Метод перехода на страницу аутентификации
    /// </summary>
    /// <returns cref="{ViewResult}">Страница</returns>
    [HttpGet]
    [Route("view")]
    public IActionResult Index()
    {
        //Возврат страницы
        return View("/Zones/Start/Views/Authentication.cshtml");
    }
    #endregion
}