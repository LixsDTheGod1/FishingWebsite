using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public class PromotionDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public DateTime StartsAtUtc { get; set; }
    public DateTime EndsAtUtc { get; set; }
    public int? ProductId { get; set; }
}

public class CreatePromotionRequest
{
    [Required, MaxLength(256)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [Required, MaxLength(32)]
    public string DiscountType { get; set; } = "Percentage";

    [Range(0.01, double.MaxValue)]
    public decimal Value { get; set; }

    public DateTime StartsAtUtc { get; set; }

    public DateTime EndsAtUtc { get; set; }

    public int? ProductId { get; set; }
}

public class UpdatePromotionRequest : CreatePromotionRequest
{
}
