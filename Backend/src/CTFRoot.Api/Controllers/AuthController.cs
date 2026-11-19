using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CTFRoot.Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

namespace CTFRoot.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    RoleManager<IdentityRole> roleManager,
    IConfiguration configuration) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var email = request.Email.Trim();
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            DisplayName = request.DisplayName.Trim()
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(new
            {
                message = "The account could not be created.",
                errors = createResult.Errors.Select(error => new
                {
                    code = error.Code,
                    description = error.Description
                })
            });
        }

        var playerRole = await roleManager.FindByNameAsync(CTFRootRoles.Player);
        if (playerRole is null)
        {
            var roleResult = await roleManager.CreateAsync(new IdentityRole(CTFRootRoles.Player));
            if (!roleResult.Succeeded)
            {
                await userManager.DeleteAsync(user);
                return Problem(
                    title: "Account setup failed",
                    detail: "The default account role could not be initialized.",
                    statusCode: StatusCodes.Status500InternalServerError);
            }
        }

        var assignRoleResult = await userManager.AddToRoleAsync(user, CTFRootRoles.Player);
        if (!assignRoleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            return Problem(
                title: "Account setup failed",
                detail: "The default account role could not be assigned.",
                statusCode: StatusCodes.Status500InternalServerError);
        }

        var token = await CreateAccessTokenAsync(user);
        return Ok(token);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var email = request.Email.Trim();
        var user = await userManager.FindByEmailAsync(email);

        if (user is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var signInResult = await signInManager.CheckPasswordSignInAsync(
            user, request.Password, lockoutOnFailure: true);

        if (!signInResult.Succeeded)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var token = await CreateAccessTokenAsync(user);
        return Ok(token);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }

        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return Unauthorized();
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            user.DisplayName,
            roles = await userManager.GetRolesAsync(user)
        });
    }

    private async Task<TokenResponse> CreateAccessTokenAsync(ApplicationUser user)
    {
        var issuer = configuration["Jwt:Issuer"]!;
        var audience = configuration["Jwt:Audience"]!;
        var key = configuration["Jwt:SigningKey"]!;
        var minutes = int.TryParse(configuration["Jwt:AccessTokenMinutes"], out var configuredMinutes)
            ? Math.Clamp(configuredMinutes, 5, 30)
            : 15;

        var roles = await userManager.GetRolesAsync(user);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.UserName ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var expiresAt = DateTime.UtcNow.AddMinutes(minutes);
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: expiresAt,
            signingCredentials: credentials);

        return new TokenResponse(
            new JwtSecurityTokenHandler().WriteToken(jwt),
            "Bearer",
            expiresAt);
    }
}

public sealed record RegisterRequest(
    [Required, EmailAddress, MaxLength(254)] string Email,
    [Required, MinLength(2), MaxLength(100)] string DisplayName,
    [Required, MinLength(12), MaxLength(128)] string Password);

public sealed record LoginRequest(
    [Required, EmailAddress, MaxLength(254)] string Email,
    [Required, MinLength(1), MaxLength(128)] string Password);

public sealed record TokenResponse(
    string AccessToken,
    string TokenType,
    DateTime ExpiresAtUtc);
