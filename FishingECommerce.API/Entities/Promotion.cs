namespace FishingECommerce.API.Entities;

public class Promotion
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public string DiscountType { get; set; } = "Percentage";
    public decimal Value { get; set; }

    public DateTime StartsAtUtc { get; set; }
    public DateTime EndsAtUtc { get; set; }

    public int? ProductId { get; set; }
    public Product? Product { get; set; }
}
