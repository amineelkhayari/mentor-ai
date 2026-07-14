using System.Security.Claims;
using API.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountController : BaseApiController
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ITokenService _tokenService;

    public AccountController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ITokenService tokenService)
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        if (await _userManager.FindByEmailAsync(registerDto.Email).ConfigureAwait(false) != null)
        {
            return BadRequest("Email is already registered.");
        }

        var user = new ApplicationUser
        {
            FirstName = registerDto.DisplayName,
            LastName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.UserName
        };

        var result = await _userManager.CreateAsync(user, "Pa$$w0rd").ConfigureAwait(false);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors.Select(e => e.Description));
        }

        return Ok(new
        {
            user.FirstName,
            user.Email,
            user.UserName,
            // Roles = registerDto.Roles,
            password = user.FirstName[..2].ToLower() + "@" + user.UserName!.ToUpper()
        });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.UserName).ConfigureAwait(false);
        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password).ConfigureAwait(false);
        if (!isPasswordValid)
        {
            return Unauthorized("Invalid email or password");
        }

        var roles = await _userManager.GetRolesAsync(user).ConfigureAwait(false);
        roles = roles.Any() ? roles : new List<string> { "Basic" };

        var token = await _tokenService.CreateToken(user, roles.ToList()).ConfigureAwait(false);
        return Ok(
            new
            {
                roles,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = token

            }
        );
    }
    // 2. Create a new role
    //[Authorize(Policy = "RequireAdminRole")]
    [HttpPost("roles/create")]
    public async Task<IActionResult> CreateRole([FromBody] string roleName)
    {
        if (await _roleManager.RoleExistsAsync(roleName).ConfigureAwait(false))
        {
            return BadRequest("Role already exists.");
        }

        await _roleManager.CreateAsync(new IdentityRole(roleName)).ConfigureAwait(false);
        return Ok("Role created.");
    }
    // 3. Assign a role to a user
    //[Authorize(Policy = "RequireOwnerAdminRole")]
    [HttpPost("roles/assign")]
    public async Task<IActionResult> AssignRoleToUser(RoleUpdateDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email).ConfigureAwait(false);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (!await _roleManager.RoleExistsAsync(model.Role).ConfigureAwait(false))
        {
            return BadRequest("Role does not exist.");
        }
        var result = await _userManager.AddToRoleAsync(user, model.Role).ConfigureAwait(false);
        return Ok(result);
    }
    // 4. Remove a role from a user
    //[Authorize(Policy = "RequireAdminRole")]
    [HttpPost("roles/remove-from-user")]
    public async Task<IActionResult> RemoveRoleFromUser(RoleUpdateDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email).ConfigureAwait(false);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        var result = await _userManager.RemoveFromRoleAsync(user, model.Role).ConfigureAwait(false);
        return Ok(result);
    }

    // 5. Delete a role (globally)
    //[Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("roles/delete")]
    public async Task<IActionResult> DeleteRole([FromBody] string roleName)
    {
        var role = await _roleManager.FindByNameAsync(roleName).ConfigureAwait(false);
        if (role == null)
        {
            return NotFound("Role not found.");
        }

        var usersInRole = await _userManager.GetUsersInRoleAsync(roleName).ConfigureAwait(false);
        foreach (var user in usersInRole)
        {
            await _userManager.RemoveFromRoleAsync(user, roleName).ConfigureAwait(false);
        }

        var result = await _roleManager.DeleteAsync(role).ConfigureAwait(false);
        return Ok(result);
    }

    // 6. Change user password
    //[Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email).ConfigureAwait(false);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        if (User.FindFirstValue(ClaimTypes.NameIdentifier) != user.Id)
        {
            return Problem("u dont have Acess", "access", 403);
        }
        var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword).ConfigureAwait(false);
        return Ok(result);
    }

}
