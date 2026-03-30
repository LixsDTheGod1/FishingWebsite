using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public class RegisterRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(2), MaxLength(128)]
    public string UserName { get; set; } = string.Empty;

    [Required, MinLength(6), MaxLength(256)]
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class LogoutRequest
{
    /// <summary>
    /// If set, revokes only this refresh token. Otherwise all active refresh tokens for the user are revoked.
    /// </summary>
    public string? RefreshToken { get; set; }
}

public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresIn { get; set; }
    public int UserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
}
