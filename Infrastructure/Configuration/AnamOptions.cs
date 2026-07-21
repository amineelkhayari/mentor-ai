namespace Infrastructure.Configuration;

public class AnamOptions
{
    public const string SectionName = "Anam";

    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://api.anam.ai/v1";
    public string[] ApiKeys { get; set; } = [];
}
