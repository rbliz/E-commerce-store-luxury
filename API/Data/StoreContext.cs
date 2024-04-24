using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User, Role, int>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        //the tables
        public DbSet<Product> Products { get; set; } // Product Entity
        public DbSet<Basket> Baskets {get; set;} // Basket Entity

        public DbSet<Order> Orders{ get; set; } // Order Entity

        // alternative method of seeding data into the database, in this case to get the roles inside there.
        // when we create a migration, we're gonna have SQL commands to insert data into our tables.
        // below, I am setting that one of the tables is for the role (IdentityRole)
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

             // fluent configuration
                builder.Entity<User>()
                .HasOne(a => a.Address)
                .WithOne() // 1-to-1 rel
                .HasForeignKey<UserAddress>(a => a.Id)
                .OnDelete(DeleteBehavior.Cascade); // we want the userAddress to be deleted if the user is deleted

            // here I need to specify the Id because since this is gonna be inserted into the migration class
            // it doesn't have the ability to auto generate the next Id. So I have to hard code it...
            builder.Entity<Role>()
                    .HasData(
                        new Role{Id= 1, Name= "Member", NormalizedName="MEMBER"},
                        new Role{Id= 2, Name="Admin", NormalizedName="ADMIN"}
                    );
        }

    }

    
}
