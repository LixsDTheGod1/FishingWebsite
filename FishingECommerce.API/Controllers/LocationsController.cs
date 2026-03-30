using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public LocationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<FishingLocationDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<FishingLocationDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var rows = await _db.FishingLocations
            .AsNoTracking()
            .OrderByDescending(l => l.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(rows.Select(Map));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(FishingLocationDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FishingLocationDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var row = await _db.FishingLocations.AsNoTracking().FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
        if (row is null)
            return NotFound();
        return Ok(Map(row));
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(FishingLocationDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<FishingLocationDTO>> Create([FromBody] CreateFishingLocationRequest request, CancellationToken cancellationToken)
    {
        var entity = new FishingLocation
        {
            Name = request.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            Region = string.IsNullOrWhiteSpace(request.Region) ? null : request.Region.Trim(),
            LocationType = string.IsNullOrWhiteSpace(request.LocationType) ? null : request.LocationType.Trim(),
        };

        _db.FishingLocations.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, Map(entity));
    }

    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(FishingLocationDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<FishingLocationDTO>> Update(int id, [FromBody] UpdateFishingLocationRequest request, CancellationToken cancellationToken)
    {
        var entity = await _db.FishingLocations.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();

        entity.Name = request.Name.Trim();
        entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        entity.Latitude = request.Latitude;
        entity.Longitude = request.Longitude;
        entity.Region = string.IsNullOrWhiteSpace(request.Region) ? null : request.Region.Trim();
        entity.LocationType = string.IsNullOrWhiteSpace(request.LocationType) ? null : request.LocationType.Trim();

        await _db.SaveChangesAsync(cancellationToken);
        return Ok(Map(entity));
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var entity = await _db.FishingLocations.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();

        _db.FishingLocations.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static FishingLocationDTO Map(FishingLocation l) => new()
    {
        Id = l.Id,
        Name = l.Name,
        Description = l.Description,
        Latitude = l.Latitude,
        Longitude = l.Longitude,
        Region = l.Region,
        LocationType = l.LocationType,
        CreatedAtUtc = l.CreatedAtUtc,
    };
}
