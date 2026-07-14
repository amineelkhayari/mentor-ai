using System.Linq.Expressions;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces;

public interface IGenericRepository<T> where T : BaseEntity
{
    Task<T?> GetByIdAsync(int id);
    Task<IReadOnlyList<T>> ListAllAsync();

    Task<T?> GetEntityAsync(ISpecification<T> spec);
    Task<IReadOnlyList<T>> GetEntitiesAsync(ISpecification<T> spec);
    
    Task<int> CountAsync(ISpecification<T> spec);
    Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);

    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
}
