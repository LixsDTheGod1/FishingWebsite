using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDTO>> GetMe(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId.Value, cancellationToken);
        if (user is null)
            return NotFound();

        return Ok(ToResponse(user));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserPublicDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserPublicDTO>> GetPublicProfile(int id, CancellationToken cancellationToken)
    {
        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (user is null)
            return NotFound();

        return Ok(new UserPublicDTO { Id = user.Id, UserName = user.UserName });
    }

    [HttpPut("me")]
    [Authorize]
    [ProducesResponseType(typeof(UserDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDTO>> UpdateMe([FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId.Value, cancellationToken);
        if (user is null)
            return NotFound();

        var name = request.UserName.Trim();
        var taken = await _db.Users.AnyAsync(u => u.Id != user.Id && u.UserName == name, cancellationToken);
        if (taken)
            return BadRequest(new ProblemDetails { Title = "Update failed", Detail = "UserName is already taken." });

        user.UserName = name;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(ToResponse(user));
    }

    private static UserDTO ToResponse(Entities.User u) => new()
    {
        Id = u.Id,
        Email = u.Email,
        UserName = u.UserName,
        Role = u.Role,
        CreatedAtUtc = u.CreatedAtUtc,
    };
}
