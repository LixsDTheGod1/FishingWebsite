using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public class UserDTO
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}

public class UserPublicDTO
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    [Required, MinLength(2), MaxLength(128)]
    public string UserName { get; set; } = string.Empty;
}
