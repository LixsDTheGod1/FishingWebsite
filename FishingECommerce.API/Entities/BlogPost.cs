namespace FishingECommerce.API.Entities;

public class BlogPost
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string Content { get; set; } = string.Empty;
    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;
    public DateTime? PublishedAtUtc { get; set; }
}
