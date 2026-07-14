namespace Core.Specifications.Categorie;
using Core.Entities;

public class CategorieSepecification : BaseSpecification<Categorie>
{
    public CategorieSepecification(CateorieParams categorieParams)
        : base(x => (string.IsNullOrEmpty(categorieParams.Name))

        )
    {
        AddInclude(x => x.Formations);
    }
    public CategorieSepecification(int categorieId)
        : base(x => x.Id == categorieId)
    {
        AddInclude(x => x.Formations);
    }
}
