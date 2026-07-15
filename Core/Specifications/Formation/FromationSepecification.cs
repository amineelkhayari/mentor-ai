namespace Core.Specifications.Fromation;
using Core.Entities;

public class FormationSepecification : BaseSpecification<Formation>
{
    public FormationSepecification(FormationParams formationParams)
        : base(x => (string.IsNullOrEmpty(formationParams.Name))

        )
    {
        AddInclude(x => x.Category);
    }
    public FormationSepecification(int formationId)
        : base(x => x.Id == formationId)
    {
        AddInclude(x => x.Category);
        AddInclude(x=> x.Sessions);
    }
}
