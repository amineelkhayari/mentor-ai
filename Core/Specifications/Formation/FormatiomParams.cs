namespace Core.Specifications.Fromation;

public class FormationParams
{
    public const int MaxPageSize = 20;
    public int PageIndex { get; set; } = 1;
    private int _pageSize = 10;
    public int PageSize { get => _pageSize; set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
    public string? Sort { get; set; }

    public string? Name { get; set; }
}
