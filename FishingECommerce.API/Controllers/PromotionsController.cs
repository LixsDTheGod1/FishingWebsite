using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromotionsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PromotionsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<PromotionDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PromotionDTO>>> GetActive(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var rows = await _db.Promotions
            .AsNoTracking()
            .Where(p => p.StartsAtUtc <= now && p.EndsAtUtc >= now)
            .OrderByDescending(p => p.StartsAtUtc)
            .ToListAsync(cancellationToken);

        return Ok(rows.Select(Map));
    }

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(IEnumerable<PromotionDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PromotionDTO>>> GetAll(CancellationToken cancellationToken)
    {
        var rows = await _db.Promotions.AsNoTracking().OrderByDescending(p => p.StartsAtUtc).ToListAsync(cancellationToken);
        return Ok(rows.Select(Map));
    }

    [HttpGet("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(PromotionDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PromotionDTO>> GetById(int id, CancellationToken cancellationToken)
    {
        var entity = await _db.Promotions.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();
        return Ok(Map(entity));
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(PromotionDTO), StatusCodes.Status201Created)]
    public async Task<ActionResult<PromotionDTO>> Create([FromBody] CreatePromotionRequest request, CancellationToken cancellationToken)
    {
        var entity = new Promotion
        {
            Name = request.Name.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            DiscountType = request.DiscountType.Trim(),
            Value = request.Value,
            StartsAtUtc = request.StartsAtUtc,
            EndsAtUtc = request.EndsAtUtc,
            ProductId = request.ProductId,
        };

        _db.Promotions.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, Map(entity));
    }

    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(PromotionDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PromotionDTO>> Update(int id, [FromBody] UpdatePromotionRequest request, CancellationToken cancellationToken)
    {
        var entity = await _db.Promotions.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();

        entity.Name = request.Name.Trim();
        entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        entity.DiscountType = request.DiscountType.Trim();
        entity.Value = request.Value;
        entity.StartsAtUtc = request.StartsAtUtc;
        entity.EndsAtUtc = request.EndsAtUtc;
        entity.ProductId = request.ProductId;

        await _db.SaveChangesAsync(cancellationToken);
        return Ok(Map(entity));
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var entity = await _db.Promotions.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();

        _db.Promotions.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static PromotionDTO Map(Promotion p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        DiscountType = p.DiscountType,
        Value = p.Value,
        StartsAtUtc = p.StartsAtUtc,
        EndsAtUtc = p.EndsAtUtc,
        ProductId = p.ProductId,
    };
}
