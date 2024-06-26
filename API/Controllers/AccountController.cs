using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)){
                return Unauthorized();
            }
           
            var userBasket = await RetrieveBasket(loginDto.Username);
            var anonymBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            // if there is an anonymous basket then I am replacing the userBasket for it
            if(anonymBasket != null){
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                anonymBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }

            return new UserDto
            {   
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonymBasket != null ? anonymBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };
        }

        [HttpPost("register")]

        // I am returning an action result only and not of type user because after registration I will
        // redirect him to the login
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User{UserName = registerDto.Username, Email = registerDto.Email};

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded)
            {
                foreach( var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        [Authorize] // so we can only get what the method below returns if we are genuinely authenticated
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser() // no parameters because we want the user info in the token sent up with the request
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);

            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }
        
        // after setting this we need to tell the app how we are authenticating, so next we'll go the Program
        // to the AddAuthentication...

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users
                .Where(x => x.UserName == User.Identity.Name)
                .Select(user => user.Address)
                .FirstOrDefaultAsync();
        }

        // TODO: create an extension method for this, something to extract it 
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
                {
                    Response.Cookies.Delete("buyerId");
                    return null;
                }
                //this gets the basket with the items with the product info
            return await _context.Baskets
                .Include(i => i.Items) // this does not include the product info
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId); // this does not include the basket items
        }
    }
}