namespace FishingECommerce.API.Entities;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateTime OrderDateUtc { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending";

    public string? CustomerName { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
