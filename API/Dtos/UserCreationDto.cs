using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class UserCreationDto
{
    [RegularExpression(@"^[A-Z]{1,2}[0-9]{1,6}$")]
    public required string UserName { get; set; }
    [RegularExpression(@"^[A-Za-zÀÂÆÇÉÈÊËÎÏÔŒÙÛÜÝàâæçéèêëîïôœùûüýÿ -]{1,50}$")]
    public required string FirstName { get; set; }
    [RegularExpression(@"^[A-Za-zÀÂÆÇÉÈÊËÎÏÔŒÙÛÜÝàâæçéèêëîïôœùûüýÿ -]{1,50}$")]
    public required string LastName { get; set; }
    public int UnitId { get; set; }
    public required int JobTitleId { get; set; }
   
    // public List<UserRoleDto> UserRoles { get; set; } = [];
}

public class LoginDto
{
    public required string UserName { get; set; }
    public required string Password { get; set; } = "Pa$$w0rd";

}
public class RoleUpdateDto
{
    public required string Email { get; set; }
    public required string Role { get; set; }
}

public class ChangePasswordDto
{
    public required string Email { get; set; }
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
}
