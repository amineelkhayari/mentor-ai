namespace Core.Entities;

public class Formation : BaseEntity
{
    // public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int DurationHours { get; set; }

    public int CategoryId { get; set; }

    public Categorie Category { get; set; }

    public ICollection<Session> Sessions { get; set; }
        = new List<Session>();
}