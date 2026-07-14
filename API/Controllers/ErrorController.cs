using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("errors/{code}")]
[ApiExplorerSettings(IgnoreApi = true)]
public class ErrorController : BaseApiController
{
    public IActionResult Error(int code) => new ObjectResult(new ProblemDetails
    {
        Status = code,
        Detail = GetDefaultMessage(code)
    });
    private static string GetDefaultMessage(int statusCode) => statusCode switch
    {
        400 => "bad request",
        401 => "unauthorized",
        403 => "forbidden",
        404 => "not found",
        500 => "server error",
        _ => "unknown"
    };
}
