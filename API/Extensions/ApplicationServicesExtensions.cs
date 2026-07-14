using API.Helpers;
using API.Middleware;
using Infrastructure.AvatarProviders;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Configuration;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class ApplicationServicesExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerDocumentation();
        services.AddSwaggerGen();
        services.AddIdentityServices(config);
        services.AddHttpClient();
        var schoolManagement = config.GetConnectionString("schoolManagement");
        if (string.IsNullOrEmpty(schoolManagement))
        {
            throw new Exception("db not initialize");
        }

        services.AddDbContext<AppDbContext>(options =>
        options.UseMySQL(schoolManagement));
        // Dependencies Injections
        services.AddAutoMapper(typeof(MappingProfiles));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddIdentityCore<ApplicationUser>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        // Read origins from appsettings.json
        var allowedOrigins = config
            .GetSection("CorsSettings:AllowedOrigins")
            .Get<string[]>() ?? [];
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials(); // Remove if you don't use cookies/JWT cookies
            });
        });

        // servici
        services.Configure<TavusOptions>(config.GetSection(TavusOptions.SectionName));
        services.Configure<AnamOptions>(config.GetSection(AnamOptions.SectionName));

        services.AddHttpClient<TavusAvatarProvider>();
        services.AddHttpClient<AnamAvatarProvider>();

        // Register each concrete provider as IAvatarProvider so the factory
        // receives the full set via IEnumerable<IAvatarProvider>.
        services.AddScoped<IAvatarProvider>(sp => sp.GetRequiredService<TavusAvatarProvider>());
        services.AddScoped<IAvatarProvider>(sp => sp.GetRequiredService<AnamAvatarProvider>());

        services.AddScoped<IAvatarProviderFactory, AvatarProviderFactory>();

        return services;
    }
}
