using FishingECommerce.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFishingECommerce(builder.Configuration);

var app = builder.Build();

app.UseFishingECommerce();

app.Run();