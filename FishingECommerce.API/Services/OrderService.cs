using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<OrderDTO>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Orders
            .AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.Items)
            .OrderByDescending(o => o.OrderDateUtc)
            .Select(o => Map(o))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<OrderDTO>> GetForUserAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _db.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.OrderDateUtc)
            .Select(o => Map(o))
            .ToListAsync(cancellationToken);
    }

    public async Task<OrderDTO?> GetByIdForUserAsync(int orderId, int userId, CancellationToken cancellationToken = default)
    {
        var order = await _db.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId, cancellationToken);
        if (order is null || order.UserId != userId)
            return null;
        return Map(order);
    }

    public async Task<OrderDTO> CreateAsync(int userId, CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        var status = string.IsNullOrWhiteSpace(request.Status) ? "Pending" : request.Status.Trim();

        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = await _db.Products
            .AsNoTracking()
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        if (products.Count != productIds.Count)
        {
            throw new InvalidOperationException("One or more products do not exist.");
        }

        decimal total = 0;
        foreach (var line in request.Items)
        {
            var p = products.First(x => x.Id == line.ProductId);
            total += p.Price * line.Quantity;
        }

        var entity = new Order
        {
            UserId = userId,
            TotalAmount = total,
            Status = status,
            CustomerName = string.IsNullOrWhiteSpace(request.CustomerName) ? null : request.CustomerName.Trim(),
            Phone = string.IsNullOrWhiteSpace(request.Phone) ? null : request.Phone.Trim(),
            City = string.IsNullOrWhiteSpace(request.City) ? null : request.City.Trim(),
        };

        foreach (var line in request.Items)
        {
            var p = products.First(x => x.Id == line.ProductId);
            entity.Items.Add(new OrderItem
            {
                ProductId = p.Id,
                ProductName = p.Name,
                UnitPrice = p.Price,
                Quantity = line.Quantity,
            });
        }

        _db.Orders.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return Map(entity);
    }

    private static OrderDTO Map(Order o) => new()
    {
        Id = o.Id,
        UserId = o.UserId,
        UserEmail = o.User?.Email,
        UserName = o.User?.UserName,
        OrderDateUtc = o.OrderDateUtc,
        TotalAmount = o.TotalAmount,
        Status = o.Status,
        CustomerName = o.CustomerName,
        Phone = o.Phone,
        City = o.City,
        Items = o.Items
            .OrderBy(i => i.Id)
            .Select(i => new OrderItemDTO
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity,
            })
            .ToList(),
    };
}
