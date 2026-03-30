namespace FishingECommerce.API.Entities;

public class FishingLocation
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public string? Region { get; set; }
    public string? LocationType { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public int? CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }
}
