using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications.Fromation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize(policy: "ApiScope")]
[Route("api/[controller]")]
public class FormationsController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public FormationsController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    [HttpGet]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetAll([FromQuery] FormationParams formationParams)
    {
        var spec = new FormationSepecification(formationParams);
        var formations = await _uow
            .Repository<Formation>()
            .GetEntitiesAsync(spec)
            .ConfigureAwait(false);

        return Ok(_mapper.Map<List<CreateFormationDto>>(formations));
    }

    [HttpGet("{id:int}")]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetById(int id)
    {
        var spec = new FormationSepecification(id);

        var formation = await _uow
            .Repository<Formation>()
            .GetEntityAsync(spec)
            .ConfigureAwait(false);

        if (formation == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<FormationDto>(formation));
    }

    [HttpPost]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Create(CreateFormationDto dto)
    {
        var exists = await _uow
            .Repository<Formation>()
            .AnyAsync(x => x.Title == dto.Title)
            .ConfigureAwait(false);

        if (exists)
        {
            return BadRequest("Formation already exists");
        }

        var formation = new Formation
        {
            Title = dto.Title,
            Description = dto.Description,
            DurationHours = dto.DurationHours,
            CategoryId = dto.CategoryId,

        };

        _uow.Repository<Formation>().Add(formation);

        await _uow.Complete().ConfigureAwait(false);

        return Ok(formation);
    }

    [HttpPut("{id:int}")]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Update(int id, CreateFormationDto dto)
    {
        var formation = await _uow
            .Repository<Formation>()
            .GetByIdAsync(id)
            .ConfigureAwait(false);

        if (formation == null)
        {
            return NotFound();
        }

        formation.Title = dto.Title;
        formation.Description = dto.Description;
        formation.DurationHours = dto.DurationHours;
        formation.CategoryId = dto.CategoryId;
        _uow.Repository<Formation>().Update(formation);

        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Delete(int id)
    {
        var formation = await _uow
            .Repository<Formation>()
            .GetByIdAsync(id)
            .ConfigureAwait(false);

        if (formation == null)
        {
            return NotFound();
        }

        _uow.Repository<Formation>().Delete(formation);

        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }
}