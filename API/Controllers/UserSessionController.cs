using System.Security.Claims;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications.Usersession;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Authorize(policy: "ApiScope")]
[Route("api/[controller]")]
public class UserSessionsController : ControllerBase
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    public UserSessionsController(IUnitOfWork uow, IMapper mapper)
    {
        _uow = uow;
        _mapper = mapper;
    }

    // GET: api/sessions
    [HttpGet]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetAll([FromQuery] UserSessionParams userSessionParams)
    {
        ClaimsPrincipal? user = HttpContext.User;
        if (user.FindFirst(ClaimTypes.NameIdentifier)!.Value != null)
        {
            userSessionParams.userId = user.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        }
        else
        {
            return Unauthorized();
        }

        var spec = new UserSessionSepecification(userSessionParams);
        var sessions = await _uow
            .Repository<UserSession>()
            .GetEntitiesAsync(spec)
            .ConfigureAwait(false);

        return Ok(_mapper.Map<List<UserSessionDetailDto>>(sessions));
    }

    // GET: api/sessions/{id}
    [HttpGet("{id:int}")]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> GetById(int id)
    {

        ClaimsPrincipal? user = HttpContext.User;
        var userId = string.Empty;
        if (user.FindFirst(ClaimTypes.NameIdentifier)!.Value != null)
        {
            userId = user.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        }
        else
        {
            return Unauthorized();
        }

        var spec = new UserSessionSepecification(id, userId);
        var session = await _uow
            .Repository<UserSession>()
            .GetEntityAsync(spec)
            .ConfigureAwait(false);

        if (session == null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<UserSessionDto>(session));
    }

    // POST: api/sessions
    [HttpPost]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> Create(CreateUserSessionDto dto)
    {
        ClaimsPrincipal? user = HttpContext.User;

        var session = new UserSession
        {
            RegistrationDate = DateTime.UtcNow,
            SessionId = dto.SessionId,
            UserId = user.FindFirst(ClaimTypes.NameIdentifier)!.Value,
            IsCompleted = false
        };

        _uow.Repository<UserSession>().Add(session);
        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }

    // PUT: api/sessions/{id}
    [HttpPut("{id:int}")]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> Update(int id, UpdateUserSessionDto dto)
    {
        ClaimsPrincipal? user = HttpContext.User;
        var userId = string.Empty;
        if (user.FindFirst(ClaimTypes.NameIdentifier)!.Value != null)
        {
            userId = user.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        }
        else
        {
            return Unauthorized();
        }

        var spec = new UserSessionSepecification(id, userId);
        var session = await _uow
            .Repository<UserSession>()
            .GetEntityAsync(spec)
            .ConfigureAwait(false);

        if (session == null)
        {
            return NotFound();
        }

        session.IsCompleted = dto.IsCompleted;
        session.SessionId = dto.SessionId;

        _uow.Repository<UserSession>().Update(session);
        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }

    // DELETE: api/sessions/{id}
    [HttpDelete("{id:int}")]
    [Authorize(policy: "RequireBasicAdminRole")]
    public async Task<IActionResult> Delete(int id)
    {
        var session = await _uow
            .Repository<UserSession>()
            .GetByIdAsync(id).ConfigureAwait(false);

        if (session == null)
        {
            return NotFound();
        }

        _uow.Repository<UserSession>().Delete(session);
        await _uow.Complete().ConfigureAwait(false);

        return NoContent();
    }
}