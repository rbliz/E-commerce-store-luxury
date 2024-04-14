using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        //the tables
        public DbSet<Product> Products { get; set; } // Product Entity
        public DbSet<Basket> Baskets {get; set;} // Basket Entity

        // alternative method of seeding data into the database, in this case to get the roles inside there.
        // when we create a migration, we're gonna have SQL commands to insert data into our tables.
        // below, I am setting that one of the tables is for the role (IdentityRole)
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>()
                    .HasData(
                        new IdentityRole{Name= "Member", NormalizedName="MEMBER"},
                        new IdentityRole{Name="Admin", NormalizedName="ADMIN"}
                    );
        }

    }

    
}
