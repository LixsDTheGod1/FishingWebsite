namespace FishingECommerce.API.Entities;

public class EventRegistration
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int FishingEventId { get; set; }
    public FishingEvent FishingEvent { get; set; } = null!;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
