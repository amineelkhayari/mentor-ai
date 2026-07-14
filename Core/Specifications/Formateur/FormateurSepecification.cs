using Core.Specifications.Categorie;
namespace Core.Specifications.Formateur;
using Core.Entities;

public class FormateurSepecification : BaseSpecification<Formateur>
{
    public FormateurSepecification(FormateurParams formateurParams)
        : base(x => (string.IsNullOrEmpty(formateurParams.Name))

        )
    {
        AddInclude(x => x.Sessions);
    }
    public FormateurSepecification(int formateurId)
        : base(x => x.Id == formateurId)
    {
        AddInclude(x => x.Sessions);
    }
}
