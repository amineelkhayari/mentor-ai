using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Core.Interfaces;
using Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace Infrastructure.AvatarProviders;

public class TavusAvatarProvider : IAvatarProvider
{
    public string ProviderName => "tavus";

    private readonly HttpClient _http;
    private readonly TavusOptions _options;

    public TavusAvatarProvider(HttpClient http, IOptions<TavusOptions> options)
    {
        _options = options.Value;
        _http = http;
        _http.BaseAddress = new Uri(_options.BaseUrl);
        _http.DefaultRequestHeaders.Remove("x-api-key");
        _options.ApiKey = _options.ApiKeys[Random.Shared.Next(_options.ApiKeys.Length)];
        _http.DefaultRequestHeaders.Add("x-api-key", _options.ApiKey);
    }

    public async Task<AvatarSessionResponse> CreateSessionAsync(AvatarSessionRequest request, CancellationToken ct = default)
    {
        var payload = new
        {
            // replica_id = request.AvatarId,
            // conversation_name = request.ExternalUserId ?? Guid.NewGuid().ToString(),
            conversational_context = request.SystemPrompt,
            replica_id = request.AvatarId,
            persona_id = request.ExternalUserId,
            // replica_id = "r92debe21318",
            //persona_id = "p735435f8c36",
            // conversational_context = "talk about flutter dev mobile",
            properties = new
            {
                participant_left_timeout = 0,
                enable_closed_captions = true,
                language = "French"
            }
        };

        var response = await _http.PostAsJsonAsync(_options.BaseUrl + "/conversations/", payload, ct).ConfigureAwait(false);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<TavusConversationResponse>(cancellationToken: ct).ConfigureAwait(false)
            ?? throw new InvalidOperationException("Empty response from Tavus.");

        return new AvatarSessionResponse
        {
            SessionId = result.ConversationId,
            JoinUrl = result.ConversationUrl,
            ProviderName = ProviderName
        };
    }

    public async Task<bool> EndSessionAsync(string sessionId, CancellationToken ct = default)
    {
        var response = await _http.PostAsync(_options.BaseUrl + $"conversations/{sessionId}/end", null, ct).ConfigureAwait(false);
        return response.IsSuccessStatusCode;
    }

    private class TavusConversationResponse
    {
        [JsonPropertyName("conversation_id")]
        public string ConversationId { get; set; } = string.Empty;

        [JsonPropertyName("conversation_url")]
        public string ConversationUrl { get; set; } = string.Empty;
    }
}
