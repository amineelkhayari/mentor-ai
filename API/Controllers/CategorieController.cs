using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications.Categorie;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers;

[ApiController]
[Authorize(policy: "ApiScope")]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public CategoriesController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }
    [HttpGet("{id}")]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetCategorie(int id)
    {
        var spec = new CategorieSepecification(id);
        var cat = await _uow.Repository<Categorie>().GetEntityAsync(spec).ConfigureAwait(false);
        var catDto = _mapper.Map<CategorieDto>(cat);

        return Ok(catDto);
    }

    [HttpGet]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetAll([FromQuery] CateorieParams categorieParams)
    {

        var spec = new CategorieSepecification(categorieParams);
        var cats = await _uow.Repository<Categorie>().GetEntitiesAsync(spec).ConfigureAwait(false);
        var catsDtos = _mapper.Map<List<CategorieDto>>(cats);

        return Ok(catsDtos);
    }
    [HttpPost]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Create(CreateCategorieDto dto)
    {
        var exists = await _uow
            .Repository<Categorie>()
            .AnyAsync(x => x.Name == dto.Name).ConfigureAwait(false);

        if (exists)
        {
            return BadRequest("Category already exists");

        }

        var category = new Categorie
        {
            Name = dto.Name,
            Description = dto.Description
        };

        _uow.Repository<Categorie>().Add(category);

        await _uow.Complete().ConfigureAwait(false);

        return Ok(category);
    }

    [HttpPut("{id}")]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Update(int id, UpdateCategorieDto dto)
    {
        var category = await _uow
            .Repository<Categorie>()
            .GetByIdAsync(id).ConfigureAwait(false);

        if (category == null)
        {
            return NotFound();
        }

        category.Name = dto.Name;
        category.Description = dto.Description;

        _uow.Repository<Categorie>().Update(category);

        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _uow
            .Repository<Categorie>()
            .GetByIdAsync(id).ConfigureAwait(false);

        if (category == null)
        {
            return NotFound();
        }

        _uow.Repository<Categorie>().Delete(category);

        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }
}