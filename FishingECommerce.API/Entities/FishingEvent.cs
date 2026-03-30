namespace FishingECommerce.API.Entities;

public enum FishingEventType
{
    Express = 1,
    Adventure = 2,
}

public class FishingEvent
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string? FullDescription { get; set; }

    public string? ImageUrl { get; set; }

    public FishingEventType Type { get; set; }

    public int Nights { get; set; }

    public string Location { get; set; } = string.Empty;

    public decimal TotalPrice { get; set; }

    public int Capacity { get; set; }

    public int OccupiedSeats { get; set; }

    public decimal GuideRating { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<EventRegistration> Registrations { get; set; } = new List<EventRegistration>();
}
