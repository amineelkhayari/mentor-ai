namespace Infrastructure.Configuration;

public class TavusOptions
{
    public const string SectionName = "Tavus";

    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://tavusapi.com/v2";
}
