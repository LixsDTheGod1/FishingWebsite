using FishingECommerce.API.Data;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseFishingECommerce(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fishing ECommerce API v1");
                c.RoutePrefix = "swagger";
            });

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                db.Database.Migrate();
                SeedData.SeedAsync(db).GetAwaiter().GetResult();
            }
        }

        app.UseHttpsRedirection();

        app.UseCors("Frontend");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        return app;
    }
}
