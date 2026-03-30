using System.ComponentModel.DataAnnotations;

namespace FishingECommerce.API.Contracts;

public class BlogPostResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Content { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public DateTime? PublishedAtUtc { get; set; }
}

public class CreateBlogPostRequest
{
    [Required, MaxLength(256)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(256)]
    public string? Slug { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime? PublishedAtUtc { get; set; }
}

public class UpdateBlogPostRequest
{
    [Required, MaxLength(256)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(256)]
    public string? Slug { get; set; }

    [Required]
    public string Content { get; set; } = string.Empty;

    public DateTime? PublishedAtUtc { get; set; }
}
