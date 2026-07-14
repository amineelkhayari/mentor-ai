namespace API.Dtos;

    // Create Category
    public class CreateCategorieDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    // Update Category
    public class UpdateCategorieDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    // Response DTO
    public class CategorieDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
        public ICollection<FormationDto> Formations { get; set; } = new List<FormationDto>();
    }

    // Search / Filter DTO (Optional)
    public class CategorieSearchDto
    {
        public string? Name { get; set; }
    }
