using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using CTFRoot.Infrastructure.Persistence;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit;

namespace CTFRoot.UnitTests;

public sealed class AuthEndpointsTests : IClassFixture<AuthApiFactory>
{
    private readonly HttpClient _client;

    public AuthEndpointsTests(AuthApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_CreatesPlayerAccount_AndReturnsUsableAccessToken()
    {
        var response = await RegisterAsync("player-one@example.test");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var tokenDocument = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var token = tokenDocument.RootElement.GetProperty("accessToken").GetString();

        Assert.False(string.IsNullOrWhiteSpace(token));

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var profileResponse = await _client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.OK, profileResponse.StatusCode);
        using var profile = JsonDocument.Parse(await profileResponse.Content.ReadAsStringAsync());
        Assert.Equal("player-one@example.test", profile.RootElement.GetProperty("email").GetString());
        Assert.Equal("Test Player", profile.RootElement.GetProperty("displayName").GetString());
        Assert.Contains(
            profile.RootElement.GetProperty("roles").EnumerateArray(),
            role => role.GetString() == "Player");
        _client.DefaultRequestHeaders.Authorization = null;
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsAccessToken()
    {
        var registration = await RegisterAsync("login-player@example.test");
        Assert.Equal(HttpStatusCode.OK, registration.StatusCode);

        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "login-player@example.test",
            password = "Str0ng!Passw0rd"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var token = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.False(string.IsNullOrWhiteSpace(token.RootElement.GetProperty("accessToken").GetString()));
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsGenericUnauthorizedResponse()
    {
        await RegisterAsync("wrong-password@example.test");

        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "wrong-password@example.test",
            password = "NotTheRight!Password"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("Invalid email or password.", body);
    }

    [Fact]
    public async Task Me_WithoutToken_ReturnsUnauthorized()
    {
        _client.DefaultRequestHeaders.Authorization = null;

        var response = await _client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithWhitespaceOnlyDisplayName_IsRejected()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/register", new
        {
            email = "blank-name@example.test",
            displayName = "   ",
            password = "Str0ng!Passw0rd"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Register_DuplicateEmail_DoesNotExposeIdentityErrorDetails()
    {
        var first = await RegisterAsync("duplicate@example.test");
        var second = await RegisterAsync("duplicate@example.test");

        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, second.StatusCode);

        using var body = JsonDocument.Parse(await second.Content.ReadAsStringAsync());
        Assert.True(body.RootElement.TryGetProperty("message", out _));
        Assert.False(body.RootElement.TryGetProperty("errors", out _));
    }

    private Task<HttpResponseMessage> RegisterAsync(string email) =>
        _client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            displayName = "Test Player",
            password = "Str0ng!Passw0rd"
        });
}

public sealed class AuthApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databaseName = $"ctfroot-auth-tests-{Guid.NewGuid():N}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((_, configuration) =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:CTFRoot"] = "Server=not-used-in-tests",
                ["Jwt:Issuer"] = "CTFRoot.Tests",
                ["Jwt:Audience"] = "CTFRoot.Tests.Client",
                ["Jwt:SigningKey"] = "test-only-signing-key-that-is-longer-than-32-bytes"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<CTFRootDbContext>>();
            services.RemoveAll<CTFRootDbContext>();
            services.AddDbContext<CTFRootDbContext>(options =>
                options.UseInMemoryDatabase(_databaseName));
        });
    }
}
