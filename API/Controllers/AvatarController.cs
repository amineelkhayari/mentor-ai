using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AvatarController(IAvatarProviderFactory factory, ILogger<AvatarController> logger) : ControllerBase
{
    private readonly IAvatarProviderFactory _factory = factory;
    private readonly ILogger<AvatarController> _logger = logger;

    [HttpPost("session")]
    public async Task<ActionResult<AvatarSessionResponse>> CreateSession(
        [FromBody] AvatarSessionRequest request, CancellationToken ct)
    {
        try
        {
            IAvatarProvider? provider = _factory.Resolve(request.ProviderName);
            AvatarSessionResponse? session = await provider.CreateSessionAsync(request, ct).ConfigureAwait(false);
            return Ok(session);
        }
        catch (NotSupportedException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Provider API call failed for {Provider}", request.ProviderName);
            return StatusCode(502, new { error = "Upstream avatar provider request failed." });
        }
    }

    [HttpPost("session/{provider}/{sessionId}/end")]
    public async Task<IActionResult> EndSession(string provider, string sessionId, CancellationToken ct)
    {
        try
        {
            var avatarProvider = _factory.Resolve(provider);
            var success = await avatarProvider.EndSessionAsync(sessionId, ct).ConfigureAwait(false);
            return success ? NoContent() : StatusCode(502, new { error = "Failed to end session." });
        }
        catch (NotSupportedException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
