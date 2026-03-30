using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public sealed class CreateFishingEventRequest
{
    [Required, MaxLength(256)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [MaxLength(4000)]
    public string? FullDescription { get; set; }

    [MaxLength(2048)]
    public string? ImageUrl { get; set; }

    [Required, MaxLength(32)]
    public string Type { get; set; } = string.Empty;

    [Range(0, 365)]
    public int Nights { get; set; }

    [Required, MaxLength(256)]
    public string Location { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal TotalPrice { get; set; }

    [Range(1, int.MaxValue)]
    public int Capacity { get; set; }

    [Range(0, int.MaxValue)]
    public int OccupiedSeats { get; set; }

    [Range(0, 5)]
    public decimal GuideRating { get; set; }
}

public sealed class UpdateFishingEventRequest
{
    [Required, MaxLength(256)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(4000)]
    public string? Description { get; set; }

    [MaxLength(4000)]
    public string? FullDescription { get; set; }

    [MaxLength(2048)]
    public string? ImageUrl { get; set; }

    [Required, MaxLength(32)]
    public string Type { get; set; } = string.Empty;

    [Range(0, 365)]
    public int Nights { get; set; }

    [Required, MaxLength(256)]
    public string Location { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal TotalPrice { get; set; }

    [Range(1, int.MaxValue)]
    public int Capacity { get; set; }

    [Range(0, int.MaxValue)]
    public int OccupiedSeats { get; set; }

    [Range(0, 5)]
    public decimal GuideRating { get; set; }
}
