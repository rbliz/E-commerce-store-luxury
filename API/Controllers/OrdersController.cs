using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{    
    [Authorize] // We do not want anonymous access to the methods inside here so we add the Authorize
    public class OrdersController: BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;
            
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name) // with the Authorize then we can ensure we can use the Where()
                    .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder" )]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            // now I need to, first go get the basket, and for that I will use a method, but to make it better I will create an extension method outside here
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

                if (basket == null) return BadRequest(new ProblemDetails{Title = "Could not locate basket"});

            // now build the list of order items
            var items = new List<OrderItem>();

            // we have to check the, for instance, the price against the db when we add the product to the order because the property value might have changed

            foreach(var item in basket.Items)
            {
                // creating a variable for the product in the item
                var productItem = await _context.Products.FindAsync(item.ProductId); 
                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl,
                };

                // the order item itself
                var orderItem = new OrderItem 
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity,
                };

                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            // now work out the price info
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = subtotal > 100000? 0: 1000;

            // now actually creating the order itself
            var order = new Order
            {
                OrderItems = items,
                DeliveryFee = deliveryFee,
                SubTotal = subtotal,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
            };

            // now track it in EF
            _context.Orders.Add(order);

            // now, since we have an order we dont need the basket anymore
            _context.Baskets.Remove(basket);

            if(orderDto.SaveAddress)
            {
                // query directly the db to get the user w/o using the userManager
                var user = await _context.Users
                    .Include(a => a.Address) // because the address is a related prop, if we get the user and need to update the address we have to include(the address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                // then to update the address I have to store the new address in a new variable...    
                var address = new UserAddress
                {
                    FullName = orderDto.ShippingAddress.FullName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country,
                };
                user.Address = address; // then I asign the variable as the value to the user's address
            }

            var result = await _context.SaveChangesAsync() > 0;

            // we return createdatroute because we need to add a location header and the value that we're returning
            // what we are creating is an individual order, thus the route name is "Get Order" specified in the httpget
            // the route values is what we need to send up as a route param to get the individual order, thus the id
            // the third param is what we are gonna return but since we are wrapping up our response
            // inside a createdatroute, the type does not need to match therefore I do not need to 
            // specify here the return of the entire order obj. 
            // also, if I wanted I could specify above that the Task would return an <int>
            if(result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

            return BadRequest("Problem creating order");
        }
    }

}