namespace Core.Entities;

public class Categorie : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ICollection<Formation> Formations { get; set; }
        = new List<Formation>();
}