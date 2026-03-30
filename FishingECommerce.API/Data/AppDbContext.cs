using FishingECommerce.API.Entities;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
    public DbSet<FishingLocation> FishingLocations => Set<FishingLocation>();
    public DbSet<Promotion> Promotions => Set<Promotion>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("Users");
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Role).HasMaxLength(32);
        });

        modelBuilder.Entity<Product>(e =>
        {
            e.ToTable("Products");
            e.Property(p => p.Price).HasPrecision(18, 2);
            e.Property(p => p.Category).HasMaxLength(128);
            e.Property(p => p.ImageUrl).HasMaxLength(2048);
        });

        modelBuilder.Entity<Order>(e =>
        {
            e.ToTable("Orders");
            e.Property(o => o.TotalAmount).HasPrecision(18, 2);
            e.Property(o => o.CustomerName).HasMaxLength(256);
            e.Property(o => o.Phone).HasMaxLength(64);
            e.Property(o => o.City).HasMaxLength(128);
            e.HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<OrderItem>(e =>
        {
            e.ToTable("OrderItems");
            e.Property(i => i.ProductName).HasMaxLength(256);
            e.Property(i => i.UnitPrice).HasPrecision(18, 2);
            e.HasOne(i => i.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(i => i.Product)
                .WithMany()
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CartItem>(e =>
        {
            e.ToTable("CartItems");
            e.HasOne(c => c.User)
                .WithMany(u => u.CartItems)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasOne(c => c.Product)
                .WithMany(p => p.CartItems)
                .HasForeignKey(c => c.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(c => new { c.UserId, c.ProductId }).IsUnique();
        });

        modelBuilder.Entity<Review>(e =>
        {
            e.ToTable("Reviews");
            e.HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(r => r.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(r => new { r.UserId, r.ProductId }).IsUnique();
        });

        modelBuilder.Entity<BlogPost>(e =>
        {
            e.ToTable("BlogPosts");
            e.HasOne(b => b.Author)
                .WithMany(u => u.BlogPosts)
                .HasForeignKey(b => b.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<FishingLocation>(e =>
        {
            e.ToTable("FishingLocations");
            e.Property(l => l.Latitude).HasPrecision(9, 6);
            e.Property(l => l.Longitude).HasPrecision(9, 6);
            e.Property(l => l.Name).HasMaxLength(256);
            e.Property(l => l.Region).HasMaxLength(256);
            e.Property(l => l.LocationType).HasMaxLength(64);
            e.HasIndex(l => l.Region);

            e.HasOne(l => l.CreatedByUser)
                .WithMany()
                .HasForeignKey(l => l.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Promotion>(e =>
        {
            e.ToTable("Promotions");
            e.Property(p => p.Name).HasMaxLength(256);
            e.Property(p => p.DiscountType).HasMaxLength(32);
            e.Property(p => p.Value).HasPrecision(18, 2);
            e.HasIndex(p => new { p.StartsAtUtc, p.EndsAtUtc });

            e.HasOne(p => p.Product)
                .WithMany()
                .HasForeignKey(p => p.ProductId)
                .OnDelete(DeleteBehavior.SetNull);

            e.HasData(
                new Promotion
                {
                    Id = 1,
                    Name = "SD10",
                    Description = "10% отстъпка",
                    DiscountType = "Percentage",
                    Value = 10m,
                    StartsAtUtc = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndsAtUtc = new DateTime(2036, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    ProductId = null,
                },
                new Promotion
                {
                    Id = 2,
                    Name = "SD20",
                    Description = "20% отстъпка",
                    DiscountType = "Percentage",
                    Value = 20m,
                    StartsAtUtc = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    EndsAtUtc = new DateTime(2036, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    ProductId = null,
                });
        });

        modelBuilder.Entity<RefreshToken>(e =>
        {
            e.ToTable("RefreshTokens");
            e.HasIndex(r => r.Token).IsUnique();
            e.HasOne(r => r.User)
                .WithMany(u => u.RefreshTokens)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
