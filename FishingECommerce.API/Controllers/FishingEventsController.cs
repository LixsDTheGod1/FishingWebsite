using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Entities;
using FishingECommerce.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FishingEventsController : ControllerBase
{
    private readonly AppDbContext _db;

    public FishingEventsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<FishingEventDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<FishingEventDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var rows = await _db.FishingEvents
            .AsNoTracking()
            .OrderByDescending(e => e.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(rows.Select(Map));
    }

    [HttpGet("my/registrations")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<MyEventRegistrationDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MyEventRegistrationDTO>>> GetMyRegistrations(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var rows = await _db.EventRegistrations
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new MyEventRegistrationDTO
            {
                RegistrationId = r.Id,
                Event = Map(r.FishingEvent),
            })
            .ToListAsync(cancellationToken);

        return Ok(rows);
    }

    [HttpGet("my")]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<FishingEventDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<FishingEventDTO>>> GetMy(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var rows = await _db.EventRegistrations
            .AsNoTracking()
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => r.FishingEvent)
            .ToListAsync(cancellationToken);

        return Ok(rows.Select(Map));
    }

    [HttpGet("{id:int}/participants")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(IEnumerable<EventParticipantDTO>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IEnumerable<EventParticipantDTO>>> GetParticipants(int id, CancellationToken cancellationToken)
    {
        var exists = await _db.FishingEvents.AsNoTracking().AnyAsync(e => e.Id == id, cancellationToken);
        if (!exists)
            return NotFound();

        var users = await _db.EventRegistrations
            .AsNoTracking()
            .Where(r => r.FishingEventId == id)
            .OrderByDescending(r => r.CreatedAtUtc)
            .Select(r => new EventParticipantDTO { RegistrationId = r.Id, UserId = r.User.Id, UserName = r.User.UserName })
            .ToListAsync(cancellationToken);

        return Ok(users);
    }

    [HttpDelete("registrations/{registrationId:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RemoveParticipant(int registrationId, CancellationToken cancellationToken)
    {
        var reg = await _db.EventRegistrations
            .AsNoTracking()
            .Where(r => r.Id == registrationId)
            .Select(r => new { r.Id, r.FishingEventId })
            .FirstOrDefaultAsync(cancellationToken);

        if (reg is null)
            return NotFound();

        await using var tx = await _db.Database.BeginTransactionAsync(cancellationToken);

        var stub = new EventRegistration { Id = reg.Id };
        _db.EventRegistrations.Attach(stub);
        _db.EventRegistrations.Remove(stub);
        await _db.SaveChangesAsync(cancellationToken);

        await _db.FishingEvents
            .Where(e => e.Id == reg.FishingEventId && e.OccupiedSeats > 0)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(e => e.OccupiedSeats, e => e.OccupiedSeats - 1), cancellationToken);

        await tx.CommitAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(FishingEventDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<FishingEventDTO>> Create([FromBody] CreateFishingEventRequest request, CancellationToken cancellationToken)
    {
        var entity = new FishingEvent
        {
            Title = request.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            FullDescription = string.IsNullOrWhiteSpace(request.FullDescription) ? null : request.FullDescription.Trim(),
            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim(),
            Type = ParseTypeOrThrow(request.Type),
            Nights = request.Nights,
            Location = request.Location.Trim(),
            TotalPrice = request.TotalPrice,
            Capacity = request.Capacity,
            OccupiedSeats = request.OccupiedSeats,
            GuideRating = request.GuideRating,
        };

        _db.FishingEvents.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetAll), new { id = entity.Id }, Map(entity));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(FishingEventDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FishingEventDTO>> Update(int id, [FromBody] UpdateFishingEventRequest request, CancellationToken cancellationToken)
    {
        var entity = await _db.FishingEvents.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();

        entity.Title = request.Title.Trim();
        entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        entity.FullDescription = string.IsNullOrWhiteSpace(request.FullDescription) ? null : request.FullDescription.Trim();
        entity.ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim();
        entity.Type = ParseTypeOrThrow(request.Type);
        entity.Nights = request.Nights;
        entity.Location = request.Location.Trim();
        entity.TotalPrice = request.TotalPrice;
        entity.Capacity = request.Capacity;
        entity.OccupiedSeats = request.OccupiedSeats;
        entity.GuideRating = request.GuideRating;

        await _db.SaveChangesAsync(cancellationToken);
        return Ok(Map(entity));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var entity = await _db.FishingEvents.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();

        _db.FishingEvents.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    [HttpPost("{id:int}/signup")]
    [Authorize]
    [ProducesResponseType(typeof(SignupTicketDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Signup(int id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var exists = await _db.FishingEvents.AsNoTracking().AnyAsync(e => e.Id == id, cancellationToken);
        if (!exists)
        {
            return NotFound(new ProblemDetails
            {
                Title = "Not found",
                Detail = "Fishing event was not found.",
            });
        }

        var alreadyRegistered = await _db.EventRegistrations
            .AsNoTracking()
            .AnyAsync(r => r.UserId == userId.Value && r.FishingEventId == id, cancellationToken);

        if (alreadyRegistered)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Вече записан",
                Detail = "Вие вече сте записани за това събитие.",
            });
        }

        await using var tx = await _db.Database.BeginTransactionAsync(cancellationToken);

        var registration = new EventRegistration
        {
            UserId = userId.Value,
            FishingEventId = id,
        };

        _db.EventRegistrations.Add(registration);

        try
        {
            await _db.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Вече записан",
                Detail = "Вие вече сте записани за това събитие.",
            });
        }

        var updated = await _db.FishingEvents
            .Where(e => e.Id == id && e.OccupiedSeats < e.Capacity)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(e => e.OccupiedSeats, e => e.OccupiedSeats + 1), cancellationToken);

        if (updated == 0)
        {
            await tx.RollbackAsync(cancellationToken);
            return Conflict(new ProblemDetails
            {
                Title = "Няма свободни места",
                Detail = "Няма свободни места за това събитие.",
            });
        }

        var ticket = await _db.EventRegistrations
            .AsNoTracking()
            .Where(r => r.Id == registration.Id)
            .Select(r => new SignupTicketDTO
            {
                RegistrationId = r.Id,
                UserName = r.User.UserName,
                EventTitle = r.FishingEvent.Title,
            })
            .FirstAsync(cancellationToken);

        await tx.CommitAsync(cancellationToken);
        return Ok(ticket);
    }

    private static FishingEventDTO Map(FishingEvent e) => new()
    {
        Id = e.Id,
        Title = e.Title,
        Description = e.Description,
        FullDescription = e.FullDescription,
        ImageUrl = e.ImageUrl,
        Type = e.Type.ToString(),
        Nights = e.Nights,
        Location = e.Location,
        TotalPrice = e.TotalPrice,
        Capacity = e.Capacity,
        OccupiedSeats = e.OccupiedSeats,
        RemainingSeats = Math.Max(0, e.Capacity - e.OccupiedSeats),
        GuideRating = e.GuideRating,
        CreatedAtUtc = e.CreatedAtUtc,
    };

    private static FishingEventType ParseTypeOrThrow(string type)
    {
        if (Enum.TryParse<FishingEventType>(type, ignoreCase: true, out var parsed))
            return parsed;
        throw new ArgumentException("Invalid event type. Allowed: Express, Adventure.");
    }
}
