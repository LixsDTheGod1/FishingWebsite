using System.Security.Claims;
using FishingECommerce.API.Contracts;
using FishingECommerce.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace FishingECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth)
    {
        _auth = auth;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var (ok, error, result) = await _auth.RegisterAsync(request, cancellationToken);
        if (!ok)
            return BadRequest(new ProblemDetails { Title = "Registration failed", Detail = error });
        return Ok(result);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var (ok, error, result) = await _auth.LoginAsync(request, cancellationToken);
        if (!ok)
            return Unauthorized(new ProblemDetails { Title = "Login failed", Detail = error });
        return Ok(result);
    }

    /// <summary>
    /// Ends the session by revoking refresh token(s). Requires a valid JWT. Pass <see cref="LogoutRequest.RefreshToken"/> for one device, or omit / empty body to revoke all sessions.
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Logout(
        [FromBody(EmptyBodyBehavior = EmptyBodyBehavior.Allow)] LogoutRequest? request,
        CancellationToken cancellationToken)
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(idClaim) || !int.TryParse(idClaim, out var userId))
            return Unauthorized();

        await _auth.LogoutAsync(userId, request ?? new LogoutRequest(), cancellationToken);
        return NoContent();
    }
}
