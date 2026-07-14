using System.Diagnostics;
using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Serilog.Context;

namespace API.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;

        using (LogContext.PushProperty("TraceId", traceId))
        {
            _logger.LogError(exception, exception.Message);
        }

        var problemDetails = new ProblemDetails
        {
            Type = exception.GetType().ToString(),
            Status = (int)HttpStatusCode.InternalServerError,
            Title = exception.Message,
            Extensions = new Dictionary<string, object?> { { "traceId", traceId } }
        };

        httpContext.Response.ContentType = "application/json";
        httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var json = JsonSerializer.Serialize(problemDetails, options);

        await httpContext.Response.WriteAsync(json, cancellationToken).ConfigureAwait(false);

        return true;
    }
}
