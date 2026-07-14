using Core.Entities;

namespace Core.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(ApplicationUser user, List<string> roles);
}