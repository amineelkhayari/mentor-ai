using System.Text;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            // Password settings
            options.Password.RequireDigit = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;

            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }
            )
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.Authority = config.GetSection("JWT")["Issuer"];
                options.Audience = config.GetSection("JWT")["Audience"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = config.GetSection("JWT")["Issuer"],
                    ValidAudience = config.GetSection("JWT")["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config.GetSection("JWT")["Key"]!))
                };
            });

        services.AddAuthorization(options =>
        {
            options.AddPolicy("ApiScope", policy =>
                        {
                            policy.RequireAuthenticatedUser();
                            policy.RequireClaim("scope", "coursera");
                        });

            options.AddPolicy("RequireAdminRole", policy =>
            {
                policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
                policy.RequireRole("admin");
            });
            options.AddPolicy("RequireBasicRole", policy =>
                        {
                            policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
                            policy.RequireRole("basic");
                        });

            options.AddPolicy("RequireBasicAdminRole", policy =>
           {
               policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
               policy.RequireRole("admin", "basic");
           });
        });

        return services;
    }

    public static string GetErrorsAsString(this IdentityResult result)
    {
        var sb = new StringBuilder();

        foreach (var error in result.Errors)
        {
            sb.AppendLine(error.Description);
        }

        return sb.ToString();
    }
}
