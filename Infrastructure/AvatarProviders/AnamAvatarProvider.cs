using System.Net.Http.Headers;
using System.Net.Http.Json;
using Core.Interfaces;
using Infrastructure.Configuration;

using Microsoft.Extensions.Options;

namespace Infrastructure.AvatarProviders;

public class AnamAvatarProvider : IAvatarProvider
{
    public string ProviderName => "anam";

    private readonly HttpClient _http;
    private readonly AnamOptions _options;

    public AnamAvatarProvider(HttpClient http, IOptions<AnamOptions> options)
    {
        _options = options.Value;
        _http = http;
        _http.BaseAddress = new Uri(_options.BaseUrl);
      _options.ApiKey = _options.ApiKeys[Random.Shared.Next(_options.ApiKeys.Length)];

        _http.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _options.ApiKey);
    }

    public async Task<AvatarSessionResponse> CreateSessionAsync(AvatarSessionRequest request, CancellationToken ct = default)
    {
        var payload = new
        {
            personaConfig = new
            {
                avatarId = request.AvatarId,
                systemPrompt = request.SystemPrompt,
                name = "Sophie",
                //avatarId = "edf6fdcb-acab-44b8-b974-ded72665ee26",
                voiceId = "8cc80a30-4fc0-11f1-84b0-52bacf74fa75",
                llmId = "a7cf662c-2ace-4de1-a21e-ef0fbf144bb7",
                //systemPrompt = "You are a helpful assistant that provides information about the school management system. You can answer questions related to student records, class schedules, and other administrative tasks."
            },
        };

        var response = await _http.PostAsJsonAsync(_options.BaseUrl + "/auth/session-token", payload, ct).ConfigureAwait(false);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<AnamSessionResponse>(cancellationToken: ct).ConfigureAwait(false)
            ?? throw new InvalidOperationException("Empty response from Anam.");

        return new AvatarSessionResponse
        {
            ClientToken = result.SessionToken,
            ProviderName = ProviderName
        };
    }

    public async Task<bool> EndSessionAsync(string sessionId, CancellationToken ct = default)
    {
        var response = await _http.PostAsync(_options.BaseUrl + $"engine/session/{sessionId}/stop", null, ct).ConfigureAwait(false);
        return response.IsSuccessStatusCode;
    }

    public record AnamSessionResponse(string SessionToken);

}
