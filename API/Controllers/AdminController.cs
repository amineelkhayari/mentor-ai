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

        return Ok(users.Select(s => new
        {
            UserName = s.Email,
            fullName = s.FirstName + " " + s.LastName
        }));
    }
}
