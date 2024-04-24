using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    // I am deriving from the IdentityUser class, thus using its properties

    // the default implementation of IdentityUser primary key uses a string, which becomes inconvenient when
    // we want to use a related property, thus I will refactor this to use an integer, by overriding what
    // the IdentityUser uses. Then I have to use an int in the Roles too... but first I need to create the Role class
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; } // 1-to-1 relationship ( user>>userAddress)
    }
}