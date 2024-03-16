using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        //the tables
        public DbSet<Product> Products { get; set; } // Product Entity
        public DbSet<Basket> Baskets {get; set;} // Basket Entity
    }

    
}
