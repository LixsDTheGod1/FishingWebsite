using FishingECommerce.API.Entities;

namespace FishingECommerce.API.Services;

public interface ITokenService
{
    string CreateAccessToken(User user);
    string CreateRefreshToken();
    int GetAccessTokenLifetimeSeconds();
}
