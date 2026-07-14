namespace API.Dtos;
// CREATE (user joins session)
public class CreateUserSessionDto
{
    public int SessionId { get; set; }
}

// UPDATE (mark completion / update status)
public class UpdateUserSessionDto
{
    public bool IsCompleted { get; set; }
    // public DateTime RegistrationDate = DateTime.UtcNow; // Optional: Update registration date on status change
    // public string UserId { get; set; } = string.Empty;
    public int SessionId { get; set; }
}

// RESPONSE (basic)
public class UserSessionDto
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public int SessionId { get; set; }

    public DateTime RegistrationDate { get; set; }
    public bool IsCompleted { get; set; }
}

// DETAILED RESPONSE (with navigation data)
public class UserSessionDetailDto
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;

    public int SessionId { get; set; }
    public string SessionTitle { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; }
    public bool IsCompleted { get; set; }
}

// OPTIONAL FILTER DTO
public class UserSessionSearchDto
{
    public string? UserId { get; set; }
    public int? SessionId { get; set; }
    public bool? IsCompleted { get; set; }
}
