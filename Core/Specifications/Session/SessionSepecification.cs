namespace Core.Specifications.Session;

using Core.Entities;

public class SessionSepecification : BaseSpecification<Session>
{
    public SessionSepecification(SessionParams sessionParams)
        : base(x => string.IsNullOrEmpty(sessionParams.Name) || x.UserSessions.Any(us => us.UserId == sessionParams.UserId))
    {
        AddInclude(x => x.Formation);
        AddInclude(y => y.Formateur);
        AddInclude(y => y.UserSessions.Where(us => us.UserId == sessionParams.UserId));
    }
    public SessionSepecification(int sessionId, string? UserId)
        : base(x => x.Id == sessionId && (string.IsNullOrEmpty(UserId) || x.UserSessions.Any(us => us.UserId == UserId)))
    {
        AddInclude(x => x.Formation);
        AddInclude(x => x.Formateur);
        // AddInclude(x => x.UserSessions);
        AddInclude(y => y.UserSessions.Where(us => us.UserId == UserId));
    }
}
