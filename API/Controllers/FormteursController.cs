using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications.Formateur;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize(policy: "RequireAdminRole")]
[Route("api/[controller]")]
public class FormateursController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;

    public FormateursController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] FormateurParams formateurParams)
    {
        var spec = new FormateurSepecification(formateurParams);
        var formateurs = await _uow
            .Repository<Formateur>()
            .GetEntitiesAsync(spec)
            .ConfigureAwait(false);

        return Ok(_mapper.Map<List<FormateurDto>>(formateurs));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var formateur = await _uow
            .Repository<Formateur>()
            .GetByIdAsync(id)
            .ConfigureAwait(false);

        if (formateur == null)
        {
            return NotFound();
        }

        return Ok(formateur);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateFormateurDto dto)
    {
        var exists = await _uow
            .Repository<Formateur>()
            .AnyAsync(x => x.Lang == dto.Lang && x.FirstMessage == dto.FirstMessage)
            .ConfigureAwait(false);

        if (exists)
        {
            return BadRequest("Formateur already exists");
        }

        var formateur = new Formateur
        {
            Lang = dto.Lang,
            FirstMessage = dto.FirstMessage,
            SystemPrompt = dto.SystemPrompt,
            VoiceProvider = dto.VoiceProvider,
            LLM_Provider = dto.LLM_Provider,
            AvatarId = dto.AvatarId,
            Name = dto.Name,
            ProviderNom =(AvatarProvider)dto.ProviderNom
        };

        _uow.Repository<Formateur>().Add(formateur);

        await _uow.Complete().ConfigureAwait(false);

        return Ok(formateur);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, FormateurDto dto)
    {
        var formateur = await _uow
            .Repository<Formateur>()
            .GetByIdAsync(id)
            .ConfigureAwait(false);

        if (formateur == null)
        {
            return NotFound();
        }

        formateur.Lang = dto.Lang;
        formateur.FirstMessage = dto.FirstMessage;
        formateur.SystemPrompt = dto.SystemPrompt;
        formateur.VoiceProvider = dto.VoiceProvider;
        formateur.LLM_Provider = dto.LLM_Provider;
        _uow.Repository<Formateur>().Update(formateur);

        await _uow.Complete().ConfigureAwait(false);

        return Ok(formateur);
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var formateur = await _uow
            .Repository<Formateur>()
            .GetByIdAsync(id)
            .ConfigureAwait(false);

        if (formateur == null)
        {
            return NotFound();
        }

        _uow.Repository<Formateur>().Delete(formateur);

        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }
}