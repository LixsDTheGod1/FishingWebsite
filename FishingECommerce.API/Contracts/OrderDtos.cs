using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public class OrderItemDTO
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}

public class OrderDTO
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserEmail { get; set; }
    public string? UserName { get; set; }
    public DateTime OrderDateUtc { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;

    public string? CustomerName { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }

    public List<OrderItemDTO> Items { get; set; } = new();
}

public class CreateOrderItemRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}

public class CreateOrderRequest
{
    [Required]
    public List<CreateOrderItemRequest> Items { get; set; } = new();

    [MaxLength(64)]
    public string? Status { get; set; }

    [MaxLength(256)]
    public string? CustomerName { get; set; }

    [MaxLength(64)]
    public string? Phone { get; set; }

    [MaxLength(128)]
    public string? City { get; set; }
}
