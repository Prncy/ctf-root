using CTFRoot.Application.Abstractions;
using CTFRoot.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("CTFRoot");
if (!string.IsNullOrWhiteSpace(connectionString))
{
    builder.Services.AddDbContext<CTFRootDbContext>(options =>
        options.UseSqlServer(connectionString));
    builder.Services.AddScoped<IApplicationDbContext>(serviceProvider =>
        serviceProvider.GetRequiredService<CTFRootDbContext>());
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
