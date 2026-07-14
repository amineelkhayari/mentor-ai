namespace Core.Entities;

public class UserSession : BaseEntity
{
    public string UserId { get; set; }

    public ApplicationUser User { get; set; }

    public int SessionId { get; set; }

    public Session Session { get; set; }

    public DateTime RegistrationDate { get; set; }

    public bool IsCompleted { get; set; } = false;
}