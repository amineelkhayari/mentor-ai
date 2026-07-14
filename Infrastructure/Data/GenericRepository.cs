using System.Linq.Expressions;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    private readonly AppDbContext _context;
    public GenericRepository(AppDbContext context) => _context = context;

    public async Task<T?> GetByIdAsync(int id) => await _context.Set<T>().SingleOrDefaultAsync(x => x.Id == id).ConfigureAwait(false);

    public async Task<IReadOnlyList<T>> ListAllAsync() => await _context.Set<T>().ToListAsync().ConfigureAwait(false);

    public async Task<T?> GetEntityAsync(ISpecification<T> spec) => await ApplySpecification(spec).SingleOrDefaultAsync().ConfigureAwait(false);

    public async Task<IReadOnlyList<T>> GetEntitiesAsync(ISpecification<T> spec) => await ApplySpecification(spec).ToListAsync().ConfigureAwait(false);

    public async Task<int> CountAsync(ISpecification<T> spec) => await ApplySpecification(spec).CountAsync().ConfigureAwait(false);

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate) => await _context.Set<T>().AnyAsync(predicate).ConfigureAwait(false);

    public void Add(T entity) => _context.Set<T>().Add(entity);

    public void AddEntities(T[] entities) => _context.Set<T>().AddRange(entities);

    public void Update(T entity)
    {
        _context.Set<T>().Attach(entity);
        _context.Entry(entity).State = EntityState.Modified;
    }

    public void Delete(T entity)
    {
        if (entity is ISoftDelete delete)
        {
            delete.IsDeleted = true;
            delete.DeletedAt = DateTime.Now;
        }
        else
        {
            _context.Set<T>().Remove(entity);
        }
    }

    private IQueryable<T> ApplySpecification(ISpecification<T> spec) => SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), spec);
}
