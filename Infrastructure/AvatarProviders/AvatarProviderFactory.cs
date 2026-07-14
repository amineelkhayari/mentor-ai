using Core.Interfaces;

namespace Infrastructure.AvatarProviders;

public class AvatarProviderFactory : IAvatarProviderFactory
{
    private readonly IEnumerable<IAvatarProvider> _providers;

    public AvatarProviderFactory(IEnumerable<IAvatarProvider> providers)
    {
        _providers = providers;
    }

    public IAvatarProvider Resolve(string providerName)
    {
        var provider = _providers.FirstOrDefault(p =>
            p.ProviderName.Equals(providerName, StringComparison.OrdinalIgnoreCase));

        if (provider is null)
        {
            var available = string.Join(", ", _providers.Select(p => p.ProviderName));
            throw new NotSupportedException(
                $"Avatar provider '{providerName}' is not supported. Available: {available}");
        }

        return provider;
    }
}
