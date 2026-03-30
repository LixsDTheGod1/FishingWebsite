using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public class FishingLocationDTO
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? Region { get; set; }
    public string? LocationType { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}

public class CreateFishingLocationRequest
{
    [Required, MaxLength(256)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [Range(-90, 90)]
    public decimal Latitude { get; set; }

    [Range(-180, 180)]
    public decimal Longitude { get; set; }

    [MaxLength(256)]
    public string? Region { get; set; }

    [MaxLength(64)]
    public string? LocationType { get; set; }
}

public class UpdateFishingLocationRequest : CreateFishingLocationRequest
{
}
