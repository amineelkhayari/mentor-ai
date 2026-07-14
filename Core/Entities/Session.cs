namespace Core.Entities;

public class Session : BaseEntity
{
    // public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public int MaxParticipants { get; set; }

    public int FormationId { get; set; }

    public Formation Formation { get; set; }
    public int FormateurId { get; set; }
// ef migrations remove
    public Formateur Formateur { get; set; }

    public ICollection<UserSession> UserSessions { get; set; }
        = new List<UserSession>();
}