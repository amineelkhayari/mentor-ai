
namespace API.Dtos;

// CREATE DTO
public class CreateFormationDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

// UPDATE DTO
public class UpdateFormationDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
}

// RESPONSE DTO
public class FormationDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int DurationHours { get; set; }
    public int CategoryId { get; set; }
}

// SEARCH DTO (OPTIONAL)
public class FormationSearchDto
{
    public string? Title { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
