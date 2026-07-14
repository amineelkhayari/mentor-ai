using System.Text;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications.Session;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize(policy: "ApiScope")]
[Route("api/[controller]")]
public class SessionsController(IUnitOfWork uow, IMapper mapper, IAvatarProviderFactory factory) : ControllerBase
{
    private readonly IUnitOfWork _uow = uow;
    private readonly IMapper _mapper = mapper;
    private readonly IAvatarProviderFactory _factory = factory;

    [HttpGet("my-session")]
    [Authorize(policy: "RequireBasicAdminRole")]
    //[AllowAnonymous]
    public async Task<IActionResult> GetMySession()
    {
        var sessionParams = new SessionParams
        {
            UserId = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
        };
        var spec = new SessionSepecification(sessionParams);
        var sessions = await _uow
            .Repository<Session>()
            .GetEntitiesAsync(spec)
            .ConfigureAwait(false);
        var result = sessions.Select(s => new SessionDto
        {
            Id = s.Id,
            Title = s.Name,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            Formation = _mapper.Map<FormationDto>(s.Formation),
            Formateur = _mapper.Map<FormateurDto>(s.Formateur),
            UserSessions = _mapper.Map<List<UserSessionDto>>(s.UserSessions)
        });
        return Ok(result);
    }
    // GET: api/sessions

    [HttpGet]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetAll([FromQuery] SessionParams sessionParams)
    {
        sessionParams.UserId = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var spec = new SessionSepecification(sessionParams);
        var sessions = await _uow
            .Repository<Session>()
            .GetEntitiesAsync(spec)
            .ConfigureAwait(false);

        var result = sessions.Select(s => new SessionDto
        {
            Id = s.Id,
            Title = s.Name,
            StartDate = s.StartDate,
            EndDate = s.EndDate,
            FormationId = s.FormationId,
            FormateurId = s.FormateurId,
            // Formation = _mapper.Map<FormationDto>(s.Formation),
            // Formateur = _mapper.Map<FormateurDto>(s.Formateur),
            UserSessions = _mapper.Map<List<UserSessionDto>>(s.UserSessions),

            SessionJoined = s.UserSessions?.Any(us => us.UserId == sessionParams.UserId) is true
                ? "Joined"
                : "Join"
        });

        return Ok(result);

    }

    // GET: api/sessions/{id}
    [HttpGet("{id:int}")]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetById(int id,CancellationToken ct)
    {
        var userID = HttpContext.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value;
        if (string.IsNullOrEmpty(userID))
        {
            return BadRequest();
        }
        var spec = new SessionSepecification(id, userID);
        var session = await _uow
            .Repository<Session>()
            .GetEntityAsync(spec).ConfigureAwait(false);

        if (session == null)
        {
            return NotFound();
        }
        var sessions = _mapper.Map<SessionDto>(session);
        var prompt = new StringBuilder();

        prompt.AppendLine("# AI Avatar System Prompt");
        prompt.AppendLine();
        prompt.AppendLine("You are an experienced AI instructor and mentor.");
        prompt.AppendLine();
        prompt.AppendLine("Your goal is to teach learners according to the current formation and session.");
        prompt.AppendLine();

        prompt.AppendLine("## Formation Information");
        prompt.AppendLine($"Formation Title: {sessions?.Formation.Title}");
        prompt.AppendLine($"Formation Description: {sessions.Formation.Description}");
        prompt.AppendLine($"Category: {sessions.Formation.CategoryId}");
        prompt.AppendLine($"Duration: {sessions.Formation.DurationHours} hours");
        prompt.AppendLine();

        prompt.AppendLine("## Current Session");
        prompt.AppendLine($"Session Name: {sessions.Title}");
        prompt.AppendLine($"Starts: {sessions.StartDate:yyyy-MM-dd HH:mm}");
        prompt.AppendLine($"Ends: {sessions.EndDate:yyyy-MM-dd HH:mm}");
        prompt.AppendLine();

        prompt.AppendLine("## Instructor");
        prompt.AppendLine("Coursera Instructor");
        prompt.AppendLine();

        prompt.AppendLine("## Responsibilities");
        prompt.AppendLine("1. Act as an expert teacher for the current formation.");
        prompt.AppendLine("2. Determine your expertise from the formation information.");
        prompt.AppendLine("3. Focus primarily on the current session.");
        prompt.AppendLine("4. Explain concepts progressively.");
        prompt.AppendLine("5. Encourage learning with questions and exercises.");
        prompt.AppendLine("6. Redirect unrelated topics.");
        prompt.AppendLine("7. Never invent information.");
        prompt.AppendLine("8. Adapt explanations to the learner level.");
        prompt.AppendLine("9. Maintain a professional teaching style.");
        prompt.AppendLine();
    
        var systemPrompt = prompt.ToString();
        if(sessions != null)
        {
            var sessionRequest = new AvatarSessionRequest();
            var formateur = sessions!.Formateur;
            sessionRequest.AvatarId = formateur.AvatarId;
            sessionRequest.ProviderName = formateur.ProviderNom.ToString();
            sessionRequest.SystemPrompt = systemPrompt;
            sessionRequest.ExternalUserId= formateur.Name;
            var dt = await CreateSessionAvatar(sessionRequest, ct).ConfigureAwait(false);
            sessions.AvatarSessionResponse = dt!;
            sessions.SessionJoined = formateur.ProviderNom.ToString();
        }
        return Ok(sessions);
    }

    // POST: api/sessions
    [HttpPost]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Create(CreateSessionDto dto)
    {
        var session = new Session
        {
            Name = dto.Title,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            FormationId = dto.FormationId,
            FormateurId = dto.FormateurId
        };

        _uow.Repository<Session>().Add(session);
        await _uow.Complete().ConfigureAwait(false);

        return Ok(session);
    }

    // PUT: api/sessions/{id}
    [HttpPut("{id:int}")]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Update(int id, UpdateSessionDto dto)
    {
        var session = await _uow
            .Repository<Session>()
            .GetByIdAsync(id).ConfigureAwait(false);

        if (session == null)
        {
            return NotFound();
        }

        session.Name = dto.Title;
        session.StartDate = dto.StartDate;
        session.EndDate = dto.EndDate;
        session.FormationId = dto.FormationId;

        _uow.Repository<Session>().Update(session);
        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }

    // DELETE: api/sessions/{id}
    [HttpDelete("{id:int}")]
    [Authorize(policy: "RequireAdminRole")]
    public async Task<IActionResult> Delete(int id)
    {
        var session = await _uow
            .Repository<Session>()
            .GetByIdAsync(id).ConfigureAwait(false);

        if (session == null)
        {
            return NotFound();
        }

        _uow.Repository<Session>().Delete(session);
        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }
    private async Task<AvatarSessionResponse> CreateSessionAvatar(AvatarSessionRequest request, CancellationToken ct)
    {
        IAvatarProvider? provider = _factory.Resolve(request.ProviderName);
        AvatarSessionResponse? session = await provider.CreateSessionAsync(request, ct).ConfigureAwait(false);
        return session;
    }
}