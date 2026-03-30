using FishingECommerce.API.Contracts;

namespace FishingECommerce.API.Services;

public interface IOrderService
{
    Task<IReadOnlyList<OrderDTO>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<OrderDTO>> GetForUserAsync(int userId, CancellationToken cancellationToken = default);
    Task<OrderDTO?> GetByIdForUserAsync(int orderId, int userId, CancellationToken cancellationToken = default);
    Task<OrderDTO> CreateAsync(int userId, CreateOrderRequest request, CancellationToken cancellationToken = default);
}
