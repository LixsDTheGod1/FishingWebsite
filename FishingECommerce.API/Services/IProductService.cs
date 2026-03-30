using FishingECommerce.API.Contracts;

namespace FishingECommerce.API.Services;

public interface IProductService
{
    Task<IReadOnlyList<ProductDTO>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductDTO?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<ProductDTO> CreateAsync(CreateProductRequest request, CancellationToken cancellationToken = default);
    Task<ProductDTO?> UpdateAsync(int id, UpdateProductRequest request, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}
