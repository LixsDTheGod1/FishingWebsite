using FishingECommerce.API.Contracts;

namespace FishingECommerce.API.Services;

public interface IAuthService
{
    Task<(bool Success, string? Error, AuthResponse? Result)> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<(bool Success, string? Error, AuthResponse? Result)> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task LogoutAsync(int userId, LogoutRequest request, CancellationToken cancellationToken = default);
}
