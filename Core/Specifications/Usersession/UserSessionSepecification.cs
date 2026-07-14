namespace Core.Specifications.Usersession;
using Core.Entities;

public class UserSessionSepecification : BaseSpecification<UserSession>
{
    public UserSessionSepecification(UserSessionParams userSessionParams)
        : base(x => (string.IsNullOrEmpty(userSessionParams.sessionId) || x.SessionId.ToString() == userSessionParams.sessionId) &&
                    (string.IsNullOrEmpty(userSessionParams.userId) || x.UserId == userSessionParams.userId)

        )
    {
        AddInclude(x => x.Session);
        AddInclude(x => x.User);

    }
    public UserSessionSepecification(int userSessionId)
        : base(x => x.Id == userSessionId)
    {
        AddInclude(x => x.Session);
        AddInclude(x => x.User);
    }
}
