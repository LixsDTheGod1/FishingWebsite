using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ProductDTO>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Products
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .Select(p => Map(p))
            .ToListAsync(cancellationToken);
    }

    public async Task<ProductDTO?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await _db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        return product is null ? null : Map(product);
    }

    public async Task<ProductDTO> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default)
    {
        var entity = new Product
        {
            Name = request.Name.Trim(),
            Category = request.Category.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim(),
            Price = request.Price,
            StockQuantity = request.StockQuantity,
        };
        _db.Products.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<ProductDTO?> UpdateAsync(int id, UpdateProductRequest request, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (entity is null)
            return null;

        entity.Name = request.Name.Trim();
        entity.Category = request.Category.Trim();
        entity.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        entity.ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? null : request.ImageUrl.Trim();
        entity.Price = request.Price;
        entity.StockQuantity = request.StockQuantity;
        await _db.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var entity = await _db.Products.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
        if (entity is null)
            return false;

        _db.Products.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ProductDTO Map(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Category = p.Category,
        Description = p.Description,
        ImageUrl = p.ImageUrl,
        Price = p.Price,
        StockQuantity = p.StockQuantity,
        CreatedAtUtc = p.CreatedAtUtc,
    };
}
