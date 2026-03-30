using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FishingECommerce.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF NOT EXISTS (SELECT 1 FROM [Promotions] WHERE [Id] = 1)
BEGIN
    SET IDENTITY_INSERT [Promotions] ON;
    INSERT INTO [Promotions] ([Id], [Description], [DiscountType], [EndsAtUtc], [Name], [ProductId], [StartsAtUtc], [Value])
    VALUES (1, N'10% отстъпка', N'Percentage', '2036-01-01T00:00:00.0000000Z', N'SD10', NULL, '2025-01-01T00:00:00.0000000Z', 10.0);
    SET IDENTITY_INSERT [Promotions] OFF;
END;

IF NOT EXISTS (SELECT 1 FROM [Promotions] WHERE [Id] = 2)
BEGIN
    SET IDENTITY_INSERT [Promotions] ON;
    INSERT INTO [Promotions] ([Id], [Description], [DiscountType], [EndsAtUtc], [Name], [ProductId], [StartsAtUtc], [Value])
    VALUES (2, N'20% отстъпка', N'Percentage', '2036-01-01T00:00:00.0000000Z', N'SD20', NULL, '2025-01-01T00:00:00.0000000Z', 20.0);
    SET IDENTITY_INSERT [Promotions] OFF;
END;
");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Promotions",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}
