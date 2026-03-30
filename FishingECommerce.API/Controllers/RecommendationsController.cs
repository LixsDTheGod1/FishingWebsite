using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public RecommendationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductDTO>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<ProductDTO>>> Get([FromQuery] int take = 6, CancellationToken cancellationToken = default)
    {
        if (take < 1) take = 1;
        if (take > 24) take = 24;

        var rated = await _db.Reviews
            .AsNoTracking()
            .GroupBy(r => r.ProductId)
            .Select(g => new { ProductId = g.Key, Avg = g.Average(x => x.Rating), Cnt = g.Count() })
            .OrderByDescending(x => x.Avg)
            .ThenByDescending(x => x.Cnt)
            .Take(take)
            .ToListAsync(cancellationToken);

        var ids = rated.Select(x => x.ProductId).ToList();

        var products = await _db.Products
            .AsNoTracking()
            .Where(p => ids.Contains(p.Id))
            .ToListAsync(cancellationToken);

        var byId = products.ToDictionary(p => p.Id);
        var result = ids.Where(byId.ContainsKey).Select(id => Map(byId[id])).ToList();

        if (result.Count < take)
        {
            var missing = take - result.Count;
            var fill = await _db.Products
                .AsNoTracking()
                .Where(p => !ids.Contains(p.Id))
                .OrderByDescending(p => p.CreatedAtUtc)
                .Take(missing)
                .Select(p => Map(p))
                .ToListAsync(cancellationToken);

            result.AddRange(fill);
        }

        return Ok(result);
    }

    private static ProductDTO Map(Entities.Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Price = p.Price,
        StockQuantity = p.StockQuantity,
        CreatedAtUtc = p.CreatedAtUtc,
    };
}
