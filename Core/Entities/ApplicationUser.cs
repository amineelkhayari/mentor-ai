
using Microsoft.AspNetCore.Identity;
namespace Core.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public ICollection<UserSession> UserSessions { get; set; }
        = new List<UserSession>();
}