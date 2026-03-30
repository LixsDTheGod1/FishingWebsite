using FishingECommerce.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FishingECommerce.API.Data;

public static class SeedData
{
    public static async Task SeedAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        var hasher = new PasswordHasher<User>();

        var author = await db.Users.FirstOrDefaultAsync(u => u.Email == "seed@grandfishing.local", cancellationToken);
        if (author is null)
        {
            author = new User
            {
                Email = "seed@grandfishing.local",
                UserName = "Grand Fishing",
                Role = "Admin",
                PasswordHash = string.Empty,
                CreatedAtUtc = DateTime.UtcNow,
            };
            author.PasswordHash = hasher.HashPassword(author, "seed");
            db.Users.Add(author);
            await db.SaveChangesAsync(cancellationToken);
        }
        else if (author.Role != "Admin")
        {
            author.Role = "Admin";
            await db.SaveChangesAsync(cancellationToken);
        }

        if (string.IsNullOrWhiteSpace(author.PasswordHash)
            || hasher.VerifyHashedPassword(author, author.PasswordHash, "seed") == PasswordVerificationResult.Failed)
        {
            author.PasswordHash = hasher.HashPassword(author, "seed");
            await db.SaveChangesAsync(cancellationToken);
        }

        var now = DateTime.UtcNow;

        var desired = new List<BlogPost>
        {
            new()
            {
                Title = "Първи стъпки в спининга: избор на въдица, макара и влакно",
                Slug = "purvi-stupki-v-spininga",
                Content =
                    "<img src=\"https://upload.wikimedia.org/wikipedia/commons/7/79/Rapala_fishing_lure.jpg\" alt=\"Примамка за спининг\" />" +
                    "<h2>Какво е спининг и защо е толкова ефективен?</h2>" +
                    "<p>Спинингът е динамичен стил, който комбинира търсене на активна риба и прецизно водене на примамката. Успехът идва от правилния баланс между такъм и примамки.</p>" +
                    "<h2>Бърз старт: такъми за начинаещи</h2>" +
                    "<ul>" +
                    "<li><strong>Въдица:</strong> 2.10–2.40 м, акция според примамките (например 5–25 г за универсален сет).</li>" +
                    "<li><strong>Макара:</strong> размер 2500–3000, плавен аванс.</li>" +
                    "<li><strong>Влакно:</strong> плетено 0.10–0.14 мм + флуорокарбон повод при нужда.</li>" +
                    "</ul>" +
                    "<h2>Примамки</h2>" +
                    "<p>Започни с няколко доказани силикона (3–4 цвята) и 1–2 воблера. По-добре малко, но подходящи, отколкото много без план.</p>",
                AuthorId = author.Id,
                PublishedAtUtc = now.AddDays(-10),
            },
            new()
            {
                Title = "Къде да търсиш щука през пролетта: плитчини, тръстики и прозорци",
                Slug = "kude-da-tursish-shtuka-prez-proletta",
                Content =
                    "<img src=\"https://upload.wikimedia.org/wikipedia/commons/9/9c/Esox_Lucius.JPG\" alt=\"Щука\" />" +
                    "<h2>Къде стои щуката?</h2>" +
                    "<p>През пролетта щуката често излиза към по-плитки участъци, които се затоплят бързо. Търси я около тръстики, паднали дървета и ясни „прозорци“ между растителността.</p>" +
                    "<h2>Работещи примамки</h2>" +
                    "<ul>" +
                    "<li>Блесни №2–№4 за активно търсене.</li>" +
                    "<li>Воблери с паузи (stop&amp;go) – често ударът идва точно на паузата.</li>" +
                    "<li>Силикони на леки джиг глави за бавно водене по ръба на тревата.</li>" +
                    "</ul>" +
                    "<h2>Тактика</h2>" +
                    "<p>Облавяй системно: първо краищата на растителността, после самите „прозорци“. Ако имаш удари без засичане – смени размер/цвят или премини на по-бавна игра.</p>",
                AuthorId = author.Id,
                PublishedAtUtc = now.AddDays(-7),
            },
            new()
            {
                Title = "Фидер риболов за шаран: такъми, монтажи и захранване",
                Slug = "fider-ribolov-za-sharan",
                Content =
                    "<img src=\"https://upload.wikimedia.org/wikipedia/commons/3/33/Carp_%28Cyprinus_carpio%29_in_aquarium.JPG\" alt=\"Шаран\" />" +
                    "<h2>Такъми</h2>" +
                    "<p>Фидерът е отличен избор за стабилен риболов на шаран в язовири и големи реки. За начало: въдица 3.60 м (до ~90 г) и хранилки 30–60 г според условията.</p>" +
                    "<h2>Монтажи</h2>" +
                    "<ul>" +
                    "<li><strong>Inline:</strong> класика, подходящ за повечето ситуации.</li>" +
                    "<li><strong>Method:</strong> супер ефективен при по-спокойни води и точен риболов на петно.</li>" +
                    "</ul>" +
                    "<h2>Захранване</h2>" +
                    "<p>По-добре по-малко, но точно и често. Първите 10–15 минути са ключови за изграждане на хранително петно. Дръж темпо и следи реакцията на рибата.</p>",
                AuthorId = author.Id,
                PublishedAtUtc = now.AddDays(-4),
            },
            new()
            {
                Title = "5 грешки, които ти пречат да хващаш костур (и как да ги поправиш)",
                Slug = "5-greshki-pri-kostur",
                Content =
                    "<img src=\"https://upload.wikimedia.org/wikipedia/commons/8/82/Perca-fluviatilis.JPG\" alt=\"Костур\" />" +
                    "<h2>Най-честите грешки</h2>" +
                    "<ol>" +
                    "<li><strong>Прекалено бързо водене:</strong> пробвай по-къси придърпвания и паузи.</li>" +
                    "<li><strong>Твърде големи примамки:</strong> често 3–5 см силикони работят най-добре.</li>" +
                    "<li><strong>Неправилен грамаж:</strong> намали джиг главата при плитко/пасивна риба.</li>" +
                    "<li><strong>Стоиш твърде дълго на едно място:</strong> мести се на 15–20 минути без активност.</li>" +
                    "<li><strong>Пренебрегваш структурата:</strong> камъни, прагове и ръбове събират пасажи.</li>" +
                    "</ol>" +
                    "<p><strong>Бонус:</strong> ако имаш почуквания без засичане, смени цвета или намали диаметъра на повода.</p>",
                AuthorId = author.Id,
                PublishedAtUtc = now.AddDays(-1),
            },
        };

        var slugs = desired.Select(p => p.Slug!).ToList();
        var existing = await db.BlogPosts
            .Where(p => p.Slug != null && slugs.Contains(p.Slug))
            .ToDictionaryAsync(p => p.Slug!, cancellationToken);

        foreach (var seed in desired)
        {
            if (seed.Slug is null)
                continue;

            if (existing.TryGetValue(seed.Slug, out var current))
            {
                current.Title = seed.Title;
                current.Content = seed.Content;
                current.AuthorId = author.Id;
                current.PublishedAtUtc ??= seed.PublishedAtUtc;
            }
            else
            {
                seed.AuthorId = author.Id;
                db.BlogPosts.Add(seed);
            }
        }

        await db.SaveChangesAsync(cancellationToken);

        var desiredProducts = new List<Product>
        {
            new()
            {
                Name = "Shimano Sedona 2500 HG",
                Category = "Макари",
                Description = "Лека и надеждна спининг макара с плавен ход и стабилен аванс – чудесен избор за костур и кефал.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/9/98/Fishing_reel.jpg",
                Price = 179.99m,
                StockQuantity = 10,
            },
            new()
            {
                Name = "Daiwa Legalis LT 3000-C",
                Category = "Макари",
                Description = "Спининг макара с компактен корпус и отличен баланс – подходяща за джиг и воблери.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/8/82/ABU_Cardinal_spinning_reels.jpg",
                Price = 219.99m,
                StockQuantity = 8,
            },
            new()
            {
                Name = "Okuma Ceymar C-30",
                Category = "Макари",
                Description = "Достъпна макара за ежедневен риболов – стабилна и лесна за поддръжка.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/2/20/Abu_Garcia_Ambassadeur_baitcasting_reel.jpg",
                Price = 129.00m,
                StockQuantity = 12,
            },
            new()
            {
                Name = "Shimano Nasci 4000 FC",
                Category = "Макари",
                Description = "Макара за по-тежък спининг и фидер – подходяща за щука и бяла риба.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/ee/Abu_Garcia_Abumatic_spincast_reel.jpg",
                Price = 329.99m,
                StockQuantity = 6,
            },
            new()
            {
                Name = "Daiwa BG 4000",
                Category = "Макари",
                Description = "Здрава макара за по-тежък риболов – подходяща за големи примамки и по-силен аванс.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Moulinet_carpe.JPG",
                Price = 279.99m,
                StockQuantity = 5,
            },
            new()
            {
                Name = "Daiwa Crossfire 2.40m 10-30g",
                Category = "Въдици",
                Description = "Универсална спининг въдица за воблери и блесни – добро усещане и здрава бланка.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/7/74/Fly_fishing_rods.JPG",
                Price = 149.99m,
                StockQuantity = 9,
            },
            new()
            {
                Name = "Shimano Catana FX 2.70m 20-50g",
                Category = "Въдици",
                Description = "Спининг въдица за по-тежки примамки – отлична за щука и риболов от бряг.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Feeder_fishing.JPG",
                Price = 189.99m,
                StockQuantity = 7,
            },
            new()
            {
                Name = "Okuma Celilo 2.10m 3-15g",
                Category = "Въдици",
                Description = "Лека въдица за микро-джиг и костур – чувствителен връх и приятна работа.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/4/44/Hand_holding_fishing_rod_20170607.jpg",
                Price = 119.99m,
                StockQuantity = 11,
            },
            new()
            {
                Name = "Daiwa Ninja Feeder 3.60m 120g",
                Category = "Въдици",
                Description = "Фидер въдица за шаран и каракуда – позволява далечни замятания и контрол на рибата.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/c/c5/Very_small_crab%2C_caught_on_a_fishing_rod.jpg",
                Price = 219.99m,
                StockQuantity = 5,
            },
            new()
            {
                Name = "Shimano Alivio CX TE 5m",
                Category = "Въдици",
                Description = "Телескопична въдица за плувка – компактна за транспорт и идеална за ежедневен риболов.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/4/4c/Old_Fisherman_with_fishing_rod%2C_in_Japan_%281914_by_Elstner_Hilton%29.jpg",
                Price = 169.00m,
                StockQuantity = 6,
            },
            new()
            {
                Name = "Rapala Original Floater 11",
                Category = "Примамки",
                Description = "Класически плаващ воблер с доказана игра – работи отлично за щука и костур.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/7/79/Rapala_fishing_lure.jpg",
                Price = 27.90m,
                StockQuantity = 24,
            },
            new()
            {
                Name = "Rapala Shad Rap 7",
                Category = "Примамки",
                Description = "Дълбокогазещ воблер за търсене на активна риба – подходящ за реки и язовири.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/0/02/GT_Poppers_-_Fishing_Lures_by_Robert_Stone.jpg",
                Price = 29.90m,
                StockQuantity = 18,
            },
            new()
            {
                Name = "Blue Fox Vibrotail Jig 29g",
                Category = "Примамки",
                Description = "Джиг примамка за бяла риба и щука – стабилна вибрация и бързо потъване.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/1/1c/Bluefox_Vibrotail_jig_fishing_lure_29_gr.jpg",
                Price = 14.90m,
                StockQuantity = 40,
            },
            new()
            {
                Name = "Helin Flatfish (класическа примамка)",
                Category = "Примамки",
                Description = "Легендарна примамка с „разлюляна“ игра – работи добре при тролинг и бавно водене.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/6/64/Helin_Tackle_Company_Flatfish_fishing_lure.jpg",
                Price = 19.50m,
                StockQuantity = 16,
            },
            new()
            {
                Name = "Rapala воблер (универсален)",
                Category = "Примамки",
                Description = "Универсален воблер за спининг риболов – надежден избор за разнообразни условия.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/1/1b/Mahogany_Fishing_Lures_by_Robert_Stone.jpg",
                Price = 21.90m,
                StockQuantity = 22,
            },
            new()
            {
                Name = "Daiwa монофилно влакно 0.25mm",
                Category = "Аксесоари",
                Description = "Прозрачно монофилно влакно за универсален риболов – добро съотношение здравина/еластичност.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/b/ba/Clear_Fishing_Line.jpg",
                Price = 9.90m,
                StockQuantity = 80,
            },
            new()
            {
                Name = "Shimano плетено влакно 0.13mm",
                Category = "Аксесоари",
                Description = "Плетено влакно за спининг – висока чувствителност и отличен контакт с примамката.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Sterna_maxima_and_fishing_line_3.jpg",
                Price = 24.90m,
                StockQuantity = 55,
            },
            new()
            {
                Name = "Куки за риболов (сет)",
                Category = "Аксесоари",
                Description = "Комплект качествени куки за различни монтажи – подходящи за плувка, фидер и дъно.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/9/92/Fish-hook.JPG",
                Price = 6.99m,
                StockQuantity = 150,
            },
            new()
            {
                Name = "Олово за риболов (sinker) – асортимент",
                Category = "Аксесоари",
                Description = "Асортимент от тежести за плувка и дъно – полезно допълнение за всяка кутия.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5e/Sinker_1.JPG",
                Price = 7.50m,
                StockQuantity = 90,
            },
            new()
            {
                Name = "Кутия за принадлежности (tackle box)",
                Category = "Аксесоари",
                Description = "Практична кутия за примамки и аксесоари – държи всичко подредено по време на риболов.",
                ImageUrl = "https://upload.wikimedia.org/wikipedia/commons/7/79/TackleBoxFortDeSoto.JPG",
                Price = 34.90m,
                StockQuantity = 20,
            },
        };

        var productNames = desiredProducts.Select(p => p.Name).ToList();
        var existingProducts = await db.Products
            .Where(p => productNames.Contains(p.Name))
            .ToDictionaryAsync(p => p.Name, cancellationToken);

        foreach (var seed in desiredProducts)
        {
            if (existingProducts.TryGetValue(seed.Name, out var current))
            {
                current.Category = seed.Category;
                current.Description = seed.Description;
                current.ImageUrl = seed.ImageUrl;
                current.Price = seed.Price;
                current.StockQuantity = seed.StockQuantity;
            }
            else
            {
                db.Products.Add(seed);
            }
        }

        await db.SaveChangesAsync(cancellationToken);
    }
}
