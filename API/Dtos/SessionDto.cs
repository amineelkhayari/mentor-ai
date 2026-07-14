using Core.Entities;
using Core.Interfaces;
namespace API.Dtos;

public class CreateSessionDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int FormationId { get; set; }
    public int FormateurId { get; set; }

}

public class UpdateSessionDto
{
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int FormationId { get; set; }
    public int FormateurId { get; set; }
}

public class SessionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int FormationId { get; set; }
    public int FormateurId { get; set; }
    public FormationDto Formation { get; set; }
    public FormateurDto Formateur { get; set; }
    public string SessionJoined { get; set; }
    public ICollection<UserSessionDto> UserSessions { get; set; }
    public AvatarSessionResponse AvatarSessionResponse { get; set; }

}
