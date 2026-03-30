using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Entities;
using FishingECommerce.API.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace FishingECommerce.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly ITokenService _tokens;
    private readonly JwtSettings _jwt;

    public AuthService(
        AppDbContext db,
        IPasswordHasher<User> passwordHasher,
        ITokenService tokens,
        IOptions<JwtSettings> jwtOptions)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _tokens = tokens;
        _jwt = jwtOptions.Value;
    }

    public async Task<(bool Success, string? Error, AuthResponse? Result)> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (await _db.Users.AnyAsync(u => u.Email == email, cancellationToken))
            return (false, "Email is already registered.", null);

        var user = new User
        {
            Email = email,
            UserName = request.UserName.Trim(),
            PasswordHash = string.Empty,
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);

        return (true, null, await BuildAuthResponseAsync(user, cancellationToken));
    }

    public async Task<(bool Success, string? Error, AuthResponse? Result)> LoginAsync(
        LoginRequest request,
        CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
        if (user is null)
            return (false, "Invalid email or password.", null);

        var verify = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            return (false, "Invalid email or password.", null);

        return (true, null, await BuildAuthResponseAsync(user, cancellationToken));
    }

    public async Task LogoutAsync(int userId, LogoutRequest request, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            var rt = await _db.RefreshTokens
                .FirstOrDefaultAsync(
                    r => r.UserId == userId && r.Token == request.RefreshToken,
                    cancellationToken);

            if (rt is not null && rt.RevokedAtUtc is null)
                rt.RevokedAtUtc = now;
        }
        else
        {
            var tokens = await _db.RefreshTokens
                .Where(r => r.UserId == userId && r.RevokedAtUtc == null)
                .ToListAsync(cancellationToken);

            foreach (var t in tokens)
                t.RevokedAtUtc = now;
        }

        await _db.SaveChangesAsync(cancellationToken);
    }

    private async Task<AuthResponse> BuildAuthResponseAsync(User user, CancellationToken cancellationToken)
    {
        var accessToken = _tokens.CreateAccessToken(user);
        var refreshPlain = _tokens.CreateRefreshToken();
        var expiresAt = DateTime.UtcNow.AddDays(_jwt.RefreshTokenExpirationDays);

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            Token = refreshPlain,
            ExpiresAtUtc = expiresAt,
        });
        await _db.SaveChangesAsync(cancellationToken);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshPlain,
            TokenType = "Bearer",
            ExpiresIn = _tokens.GetAccessTokenLifetimeSeconds(),
            UserId = user.Id,
            Email = user.Email,
            UserName = user.UserName,
        };
    }
}
