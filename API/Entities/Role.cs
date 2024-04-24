using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class Role: IdentityRole<int>
    {
        
    }
}

// then I need to go update the store context, to specify the role as well next to the type User...
// and specify int too, so it will be used in every table... meaning that all identity classes will use 
// an integer as their Id