using Microsoft.AspNetCore.Mvc;

namespace Insania.Web.Zones.Map.Controllers;

/// <summary>
/// Контроллер работы с картой
/// </summary>
/// <param cref="ILogger{MapController}" name="logger">Сервис логгирования</param>
[Route("map")]
public class MapController(ILogger<MapController> logger) : Controller
{
    #region Зависимости
    /// <summary>
    /// Сервис логгирования
    /// </summary>
    private readonly ILogger<MapController> _logger = logger;
    #endregion

    #region Методы
    /// <summary>
    /// Метод перехода на страницу карты
    /// </summary>
    /// <returns cref="{ViewResult}">Страница</returns>
    [HttpGet]
    [Route("view")]
    public IActionResult Index()
    {
        //Возврат страницы
        return View("/Zones/Map/Views/Map.cshtml");
    }
    #endregion
}