namespace API.Dtos;

public class CreateSessionResponse
{
    public bool Success { get; set; }

    /// <summary>
    /// Session ID returned by the provider.
    /// </summary>
    public string SessionId { get; set; } = string.Empty;

    /// <summary>
    /// Token required by the frontend to connect.
    /// </summary>
    public string? SessionToken { get; set; }

    /// <summary>
    /// WebSocket URL if the provider uses one.
    /// </summary>
    public string? ConnectionUrl { get; set; }

    /// <summary>
    /// Provider-specific room ID (optional).
    /// </summary>
    public string? RoomId { get; set; }

    /// <summary>
    /// Error message if creation failed.
    /// </summary>
    public string? ErrorMessage { get; set; }

    /// <summary>
    /// Raw provider response (optional, useful for debugging).
    /// </summary>
    public object? Metadata { get; set; }
}