namespace Core.Interfaces;

public interface IAvatarProviderFactory
{
    IAvatarProvider Resolve(string providerName);
}
