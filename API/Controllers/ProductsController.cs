using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        // so I am using dependency injection so I can have the StoreContext here so that I've got access to the products table in my db
        private readonly StoreContext _context;   

        public ProductsController(StoreContext context)
        {
            _context = context;
        }

        // so now I am gonna create endpoints, one to Get a List and one to Get a single product
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
           return await _context.Products.ToListAsync();

            //this OK is a 200 response
            // return Ok(products);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product == null) return NotFound();

            return product;
        }
    }
}
