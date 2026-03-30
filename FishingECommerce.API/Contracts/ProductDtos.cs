using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public class ProductDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateProductRequest
{
    [Required, MaxLength(256)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(128)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [MaxLength(2048)]
    public string? ImageUrl { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
}

public class UpdateProductRequest
{
    [Required, MaxLength(256)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(128)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [MaxLength(2048)]
    public string? ImageUrl { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }
}
