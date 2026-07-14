
namespace Core.Interfaces;

public interface IAvatarProvider
{
    /// <summary>
    /// Must match the "providerName" value used in requests, e.g. "tavus", "anam".
    /// </summary>
    string ProviderName { get; }

    Task<AvatarSessionResponse> CreateSessionAsync(AvatarSessionRequest request, CancellationToken ct = default);

    Task<bool> EndSessionAsync(string sessionId, CancellationToken ct = default);
}


public class AvatarSessionRequest
{
   
    public string ProviderName { get; set; } = string.Empty;
    public string AvatarId { get; set; } = string.Empty;
    public string? SystemPrompt { get; set; }

    public string? ExternalUserId { get; set; }
}
public class AvatarSessionResponse
{
    public string SessionId { get; set; } = string.Empty;
    public string JoinUrl { get; set; } = string.Empty;
    public string? ClientToken { get; set; }
    public string ProviderName { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
