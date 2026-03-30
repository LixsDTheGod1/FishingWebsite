namespace FishingECommerce.API.Contracts;

public sealed class FishingEventDTO
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? FullDescription { get; set; }
    public string? ImageUrl { get; set; }
    public string Type { get; set; } = string.Empty;
    public int Nights { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal TotalPrice { get; set; }
    public int Capacity { get; set; }
    public int OccupiedSeats { get; set; }
    public int RemainingSeats { get; set; }
    public decimal GuideRating { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
