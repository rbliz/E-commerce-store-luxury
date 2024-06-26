using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// ................The createdAtRoute process:...................................
// 1. naming the HttpGet route
// 2. in the HttpPost, return CreatedAtRoute("route name", object value) with the httpget name and the object
// 3. extract the object returned of the httpget request to a method
// 4. the httppost Task ActionResult will have the value of an instane of the BasketDto
// ...........................................................................................................

namespace API.Controllers
{
    public class BasketController: BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        // I am gonna identify the basket fetched with a cookie with a buyerId which is created
        // when the user creates a new Basket, then the cookie(buyerId) is sent back and forth 
        // between the client's browser and the server

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());

            if (basket == null) return NotFound();

            return basket.MapBasketToDto();
        }

       
       
        [HttpPost] 
        // we're getting the productId and the quantity from the query string
        // for ex: api/basket?productId=1&quantity=2
        // because I have the route attribute in the BaseAPi controller. It's able to read the query string
        // and as long as the keys match with the names of the parameters then it is gonna know that's 
        // where it wants to get them from
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());

            if(basket == null) basket = CreateBasket();

            var product = await _context.Products.FindAsync(productId);

            if(product == null) return BadRequest(new ProblemDetails{Title = "Product not found"});

            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0; // since the method returns an int of the number of changes, I want to check if it is greater than 0 otherwise a bad request will be returned 
            
            // we're gonna return the location of the resource. What we put in the location headers is 
            // the location of where to get the basket which contains the newly "posted" resource.
            if(result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());

            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());

            basket.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return Ok();

            return BadRequest(new ProblemDetails{Title= "Problem deleting the item"});
        }

        // .................................................................................
        // extracted methods
        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)){
                Response.Cookies.Delete("buyerId");
                return null;
            }
            //this gets the basket with the items with the product info
            return await _context.Baskets
                .Include(i => i.Items) // this does not include the product info
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId); // this does not include the basket items
        }

        // this is used to transfer the basket to the user
        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"]; // the ?? means if the expression is false execute what's on its right.
        }

        // when creating a basket, if the user is not logged in the creation is an anonymous basket
        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId)){
                buyerId = Guid.NewGuid().ToString(); 
                var cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            var basket = new Basket{BuyerId = buyerId}; // we only need this property because the Id is created by EF and the List of Items is an empty one when a instance of the basket is created
            _context.Baskets.Add(basket); //now EF will start tracking this entity I've created
            return basket;
        }

      
    }
}