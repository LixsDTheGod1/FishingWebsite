using FishingECommerce.API.Contracts;
using FishingECommerce.API.Data;
using FishingECommerce.API.Entities;
using FishingECommerce.API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogController : ControllerBase
{
    private readonly AppDbContext _db;

    public BlogController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<BlogPostResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<BlogPostResponse>>> GetPublished(CancellationToken cancellationToken)
    {
        var now = DateTime.UtcNow;
        var rows = await _db.BlogPosts
            .AsNoTracking()
            .Include(b => b.Author)
            .Where(b => b.PublishedAtUtc != null && b.PublishedAtUtc <= now)
            .OrderByDescending(b => b.PublishedAtUtc)
            .ToListAsync(cancellationToken);
        var items = rows.Select(ToResponse).ToList();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(BlogPostResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BlogPostResponse>> GetById(int id, CancellationToken cancellationToken)
    {
        var post = await _db.BlogPosts
            .AsNoTracking()
            .Include(b => b.Author)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (post is null)
            return NotFound();

        var viewerId = User.GetUserId();
        var isPublished = post.PublishedAtUtc.HasValue && post.PublishedAtUtc <= DateTime.UtcNow;
        if (!isPublished && viewerId != post.AuthorId)
            return NotFound();

        return Ok(ToResponse(post));
    }

    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(BlogPostResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<BlogPostResponse>> Create([FromBody] CreateBlogPostRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var entity = new BlogPost
        {
            Title = request.Title.Trim(),
            Slug = string.IsNullOrWhiteSpace(request.Slug) ? null : request.Slug.Trim(),
            Content = request.Content,
            AuthorId = userId.Value,
            PublishedAtUtc = request.PublishedAtUtc,
        };
        _db.BlogPosts.Add(entity);
        await _db.SaveChangesAsync(cancellationToken);

        await _db.Entry(entity).Reference(b => b.Author).LoadAsync(cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, ToResponse(entity));
    }

    [HttpPut("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(BlogPostResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<BlogPostResponse>> Update(int id, [FromBody] UpdateBlogPostRequest request, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var entity = await _db.BlogPosts.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();
        if (entity.AuthorId != userId.Value)
            return Forbid();

        entity.Title = request.Title.Trim();
        entity.Slug = string.IsNullOrWhiteSpace(request.Slug) ? null : request.Slug.Trim();
        entity.Content = request.Content;
        entity.PublishedAtUtc = request.PublishedAtUtc;
        await _db.SaveChangesAsync(cancellationToken);
        return Ok(ToResponse(entity));
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var entity = await _db.BlogPosts.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
        if (entity is null)
            return NotFound();
        if (entity.AuthorId != userId.Value)
            return Forbid();

        _db.BlogPosts.Remove(entity);
        await _db.SaveChangesAsync(cancellationToken);
        return NoContent();
    }

    private static BlogPostResponse ToResponse(BlogPost b) => new()
    {
        Id = b.Id,
        Title = b.Title,
        Slug = b.Slug,
        Content = b.Content,
        AuthorId = b.AuthorId,
        AuthorName = b.Author.UserName,
        PublishedAtUtc = b.PublishedAtUtc,
    };
}
