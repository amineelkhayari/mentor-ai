namespace API.Dtos;

public class UserRoleDto
{
    public int AppUserId { get; set; }
    public required string AppRoleId { get; set; }
    public int AppId { get; set; }
    public required string Reference { get; set; }
    public DateTime AssignmentDate { get; set; }
    public bool IsActive { get; set; }
}
    public class RegisterDto
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        //public string Password { get; set; }
        //public List<string> Roles { get; set; } = new();
    }

