using CTFRoot.Application.Abstractions;
using CTFRoot.Infrastructure.Identity;
using CTFRoot.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("CTFRoot");
if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddDbContext<CTFRootDbContext>(options =>
        options.UseSqlServer(connectionString));

    builder.Services.AddScoped<IApplicationDbContext>(serviceProvider =>
        serviceProvider.GetRequiredService<CTFRootDbContext>());

    builder.Services
        .AddIdentityCore<ApplicationUser>(options =>
        {
            options.User.RequireUniqueEmail = true;

            options.Password.RequiredLength = 12;
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;

            options.Lockout.AllowedForNewUsers = true;
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        })
        .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<CTFRootDbContext>()
        .AddDefaultTokenProviders();
}

builder.Services.AddHealthChecks();
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.UseExceptionHandler();
app.MapHealthChecks("/health");
app.MapControllers();

app.Run();

public partial class Program { }
