using API.Entities;

namespace API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(StoreContext context)
        {
            if(context.Products.Any()) return;

            var products = new List<Product>
            {
                new Product
                {
                    Name = "Ring One", 
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 20000,
                    PictureUrl = "/images/products/ring-1.jpg",
                    Brand = "Angie-R Luxury",
                    Type = "Rings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Ring Two",
                    Description = "Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
                    Price = 15000,
                    PictureUrl = "/images/products/ring-2.jpg",
                    Brand = "Angie-R Luxury",
                    Type = "Rings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Ring Three",
                    Description =
                        "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                    Price = 18000,
                    PictureUrl = "/images/products/ring-3.jpg",
                    Brand = "Michael Silver",
                    Type = "Rings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Ring Four",
                    Description =
                        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                    Price = 30000,
                    PictureUrl = "/images/products/ring-4.jpg",
                    Brand = "Michael Silver",
                    Type = "Rings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Ring Five",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 25000,
                    PictureUrl = "/images/products/ring-5.jpg",
                    Brand = "Ashanti",
                    Type = "Rings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Ring Six",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 12000,
                    PictureUrl = "/images/products/ring-6.jpg",
                    Brand = "Louis B. Clement",
                    Type = "Rings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Necklace One",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1000,
                    PictureUrl = "/images/products/necklace-1.jpg",
                    Brand = "Angie-R Luxury",
                    Type = "Necklaces",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Necklace Two",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 8000,
                    PictureUrl = "/images/products/necklace-2.jpg",
                    Brand = "Michael Silver",
                    Type = "Necklaces",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Necklace Three",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1500,
                    PictureUrl = "/images/products/necklace-3.jpg",
                    Brand = "Versatile",
                    Type = "Necklaces",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Earrings One",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1800,
                    PictureUrl = "/images/products/earrings-1.jpg",
                    Brand = "Michael Silver",
                    Type = "Earrings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Earrings Two",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1500,
                    PictureUrl = "/images/products/earrings-2.jpg",
                    Brand = "Louis B. Clement",
                    Type = "Earrings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Earrings Three",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1600,
                    PictureUrl = "/images/products/earrings-3.jpg",
                    Brand = "Louis B. Clement",
                    Type = "Earrings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Earrings Four",
                    Description =
                        "Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 1400,
                    PictureUrl = "/images/products/earrings-4.jpg",
                    Brand = "Ashanti",
                    Type = "Earrings",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Bracelet One",
                    Description =
                        "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                    Price = 25000,
                    PictureUrl = "/images/products/bracelet-1.jpg",
                    Brand = "Ashanti",
                    Type = "Bracelets",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Bracelet Two",
                    Description =
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.",
                    Price = 18999,
                    PictureUrl = "/images/products/bracelet-2.jpg",
                    Brand = "Versatile",
                    Type = "Bracelets",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Bracelet Three",
                    Description =
                        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci.",
                    Price = 19999,
                    PictureUrl = "/images/products/bracelet-3.jpg",
                    Brand = "Versatile",
                    Type = "Bracelets",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Bracelet Four",
                    Description = "Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.",
                    Price = 15000,
                    PictureUrl = "/images/products/bracelet-4.jpg",
                    Brand = "Ashanti",
                    Type = "Bracelets",
                    QuantityInStock = 100
                },
                new Product
                {
                    Name = "Bracelet Five",
                    Description =
                        "Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy.",
                    Price = 18000,
                    PictureUrl = "/images/products/bracelet-5.jpg",
                    Brand = "Michael Silver",
                    Type = "Bracelets",
                    QuantityInStock = 100
                },
            };

            foreach(var product in products)
            {
                context.Products.Add(product);
            }

            context.SaveChanges();
        }
    }
}
