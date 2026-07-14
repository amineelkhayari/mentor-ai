using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController(UserManager<ApplicationUser> userManager, IHttpClientFactory httpClientFactory
     ) : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    // private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userManager.Users
            .ToListAsync()
            .ConfigureAwait(false);

        return Ok(users);
    }
    [HttpPost("session-token-simli")]
    public async Task<IActionResult> GetSessionTokenSimli()
    {
        var _http = _httpClientFactory.CreateClient();
        var body = new
        {
            faceId = "afdb6a3e-3939-40aa-92df-01604c23101c",
            handleSilence = false,
            maxSessionLength = 3600,
            maxIdleTime = 300
        };

        var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.simli.ai/compose/token");

        request.Headers.Add("x-simli-api-key", "952bia5cahftvf5dcdj49");

        request.Content = new StringContent(
            JsonSerializer.Serialize(body),
            Encoding.UTF8,
            "application/json");

        var response = await _http.SendAsync(request).ConfigureAwait(false);

        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync().ConfigureAwait(false);

        var token =
            JsonSerializer.Deserialize<SimliTokenResponse>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

        return Ok(token!.Session_Token);
    }
    
    [HttpPost("session-token")]
    public async Task<IActionResult> GetSessionTokenAnam()
    {
        var client = _httpClientFactory.CreateClient();
        var apiKey = "MTk3NmZiMTEtNjQyYy00MGFiLWI3NDUtNmIwYTdmOTZlMjBkOmpuSnhyYkE1VVdMUituYXBJL2JOdnVnSVBVc0hNd0dvY3FjS1dhOWR3QlU9";
        var payload = new
        {
            personaConfig = new
            {
                name = "Sophie",
                avatarId = "edf6fdcb-acab-44b8-b974-ded72665ee26",
                voiceId = "8cc80a30-4fc0-11f1-84b0-52bacf74fa75",
                llmId = "a7cf662c-2ace-4de1-a21e-ef0fbf144bb7",
                systemPrompt = "You are a helpful assistant that provides information about the school management system. You can answer questions related to student records, class schedules, and other administrative tasks."
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.anam.ai/v1/auth/session-token")
        {
            Content = JsonContent.Create(payload)
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var response = await client.SendAsync(request).ConfigureAwait(false);

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            return StatusCode((int)response.StatusCode, error);
        }

        var data = await response.Content.ReadFromJsonAsync<AnamSessionResponse>().ConfigureAwait(false);
        return Ok(new { sessionToken = data?.SessionToken });
    }
}
public record AnamSessionResponse(string SessionToken);

public class SimliTokenResponse
{
    public string Session_Token { get; set; } = string.Empty;
}