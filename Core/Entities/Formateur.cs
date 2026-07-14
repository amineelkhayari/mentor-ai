namespace Core.Entities;

public class Formateur : BaseEntity
{
    public string AvatarId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Lang { get; set; } = string.Empty;
    public string FirstMessage { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string VoiceProvider { get; set; } = string.Empty;
    public string LLM_Provider { get; set; } = string.Empty;
    public AvatarProvider ProviderNom { get; set; } = AvatarProvider.Anam;

    public ICollection<Session> Sessions { get; set; }
        = new List<Session>();
}
public enum AvatarProvider
{
    Anam = 1,
    Tavus = 2
}