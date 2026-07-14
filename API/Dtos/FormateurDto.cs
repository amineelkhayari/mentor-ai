
using Core.Entities;
namespace API.Dtos;

// CREATE DTO
public class CreateFormateurDto
{
    public string AvatarId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Lang { get; set; } = string.Empty;
    public string FirstMessage { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string VoiceProvider { get; set; } = string.Empty;
    public string LLM_Provider { get; set; } = string.Empty;
    public int ProviderNom { get; set; }


}

// UPDATE DTO
public class UpdateFormateurDto
{
    public string AvatarId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Lang { get; set; } = string.Empty;
    public string FirstMessage { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string VoiceProvider { get; set; } = string.Empty;
    public string LLM_Provider { get; set; } = string.Empty;
    public AvatarProvider ProviderNom { get; set; } = AvatarProvider.Anam;



}

// RESPONSE DTO
public class FormateurDto
{
    public int Id { get; set; }


    public string AvatarId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Lang { get; set; } = string.Empty;
    public string FirstMessage { get; set; } = string.Empty;
    public string SystemPrompt { get; set; } = string.Empty;
    public string VoiceProvider { get; set; } = string.Empty;
    public string LLM_Provider { get; set; } = string.Empty;
    public AvatarProvider ProviderNom { get; set; } = AvatarProvider.Anam;


}

// SEARCH DTO (OPTIONAL)
public class FormateurSearchDto
{
    public string? Title { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
}
