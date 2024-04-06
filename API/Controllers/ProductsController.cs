using System.Text.Json;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
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
        // for Performance I will introduce deferred execution using AsQueryable(). 
        // I will use Extension Methods for the queries and take the queries logic out of the controller. Another way would be the Repository patterns
        [HttpGet]
        // since we now have an obj passed as parameters, the API controller
        // presumes that we're gonna get these values from the body of our request
        // thus we have to specify from where we gonna get them by using [From...]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams) 
        {
           var query =  _context.Products
                .Sort(productParams.OrderBy) // extension methods created outside the controller
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable(); // I cannot use the await because I am no longer working with the Db like before when executing the ToListAsync().
            
            var products = await PagedList<Product>.ToPageList(query, productParams.PageNumber, productParams.PageSize);

            // the products id of type PagedList so it has the MetaData property
            // so I am passing the products.MetaData objects which then will be serialized into JSON
            // which then we can return as our pagination header

            Response.AddPaginationHeader(products.MetaData);
            
            return products;
            
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new{brands, types}); // returning an anonymous object
        }
    }
}

