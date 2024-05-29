using System.Text.Json;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        // so I am using dependency injection so I can have the StoreContext here so that I've got access
        // to the products table in my db
        private readonly StoreContext _context;   
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _context = context;
        }

        // so now I am gonna create endpoints, one to Get a List and one to Get a single product
        // for Performance I will introduce deferred execution using AsQueryable(). 
        // I will use Extension Methods for the queries and take the queries logic out of the controller.
        // Another way would be the Repository patterns
        
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

        [HttpGet("{id}", Name = "GetProduct")]
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

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm]CreateProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);

            if(productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);
                if(imageResult.Error != null)
                    return BadRequest(new ProblemDetails{Title = imageResult.Error.Message});
                
                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }

            _context.Products.Add(product); // so at this point the productDto is mapped into the product, thus now it is something I can Add

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetProduct", new{Id = product.Id}, product);

            return BadRequest(new ProblemDetails{Title = "Problem creating new product"});
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]

        // here I specify the type return as Product and then below the return is an OK(product) response
        // because although I am updating a product I want the client to have access to the newly updated product.
        public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);
            if(product == null) return NotFound();
            _mapper.Map(productDto, product);

            if(productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);
                if(imageResult.Error!= null)
                    return BadRequest(new ProblemDetails{Title = imageResult.Error.Message});
                
                if(!string.IsNullOrEmpty(product.PublicId))
                    await _imageService.DeleteImageAsync(product.PublicId);
            
                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }

            var result = await _context.SaveChangesAsync() > 0;
            if(result) return Ok(product);

            return BadRequest(new ProblemDetails{Title = "Problem updating product"});
            
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if(product == null) return NotFound();

            if(!string.IsNullOrEmpty(product.PublicId))
                await _imageService.DeleteImageAsync(product.PublicId);
            
            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;
            if(result) return Ok();
            return BadRequest(new ProblemDetails{Title = "Problem deleting product"});
        }
    }
}

